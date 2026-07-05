package com.gocart.service;

import com.gocart.dto.CreateOrderRequest;
import com.gocart.dto.OrderStatusMessage;
import com.gocart.model.Order;
import com.gocart.model.OrderItem;
import com.gocart.model.OrderStatus;
import com.gocart.model.OrderStatusHistory;
import com.gocart.model.Product;
import com.gocart.repository.OrderRepository;
import com.gocart.repository.OrderStatusHistoryRepository;
import com.gocart.repository.ProductRepository;
import com.gocart.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final OrderStatusHistoryRepository historyRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final NotificationService notificationService;
    private final UserRepository userRepository;

    private void logHistory(String orderId, OrderStatus newStatus, OrderStatus previous, String changedBy, String note) {
        OrderStatusHistory h = new OrderStatusHistory();
        h.setOrderId(orderId);
        h.setStatus(newStatus);
        h.setPreviousStatus(previous);
        h.setChangedByUserId(changedBy);
        h.setNote(note);
        historyRepository.save(h);
    }

    public List<OrderStatusHistory> getOrderHistory(String orderId) {
        return historyRepository.findByOrderIdOrderByCreatedAtAsc(orderId);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Optional<Order> getOrderById(String id) {
        return orderRepository.findById(id);
    }

    public List<Order> getOrdersByUser(String userId) {
        return orderRepository.findByUserId(userId);
    }

    public List<Order> getOrdersByStore(String storeId) {
        return orderRepository.findByStoreId(storeId);
    }

    public List<Order> getOrdersByStoreAndStatus(String storeId, OrderStatus status) {
        return orderRepository.findByStoreIdAndStatus(storeId, status);
    }

    /**
     * Place an order from a cart. Groups items by storeId — creates ONE order per store.
     * Prices are recomputed from the database for security (client can't fake price).
     */
    public List<Order> placeOrder(String userId, CreateOrderRequest req) {
        if (req == null || req.getItems() == null || req.getItems().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cart is empty");
        }
        if (req.getAddressId() == null || req.getAddressId().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Address is required");
        }

        // Group items by storeId, looking up each product from DB
        Map<String, List<OrderItem>> itemsByStore = new LinkedHashMap<>();
        Map<String, Double> totalByStore = new LinkedHashMap<>();

        for (CreateOrderRequest.Item line : req.getItems()) {
            // Khóa hàng để check + trừ kho an toàn khi có đơn đặt song song
            Product p = productRepository.findByIdForUpdate(line.getProductId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.BAD_REQUEST, "Product not found: " + line.getProductId()));
            int qty = line.getQuantity() == null || line.getQuantity() < 1 ? 1 : line.getQuantity();

            // 1) Sản phẩm còn được bán không
            if (Boolean.FALSE.equals(p.getInStock())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Sản phẩm không còn được bán: " + p.getName());
            }
            // 2) Đủ số lượng không
            int available = p.getStockQuantity() == null ? 0 : p.getStockQuantity();
            if (available < qty) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Không đủ hàng cho \"" + p.getName() + "\" (còn " + available + ", cần " + qty + ")");
            }
            // 3) Trừ kho; hết hàng thì đánh dấu ngừng bán
            int remaining = available - qty;
            p.setStockQuantity(remaining);
            if (remaining == 0) {
                p.setInStock(false);
            }
            productRepository.save(p);

            double price = p.getPrice() == null ? 0d : p.getPrice();

            OrderItem oi = new OrderItem();
            oi.setProductId(p.getId());
            oi.setQuantity(qty);
            oi.setPrice(price);

            itemsByStore.computeIfAbsent(p.getStoreId(), k -> new ArrayList<>()).add(oi);
            totalByStore.merge(p.getStoreId(), price * qty, Double::sum);
        }

        List<Order> created = new ArrayList<>();
        for (Map.Entry<String, List<OrderItem>> entry : itemsByStore.entrySet()) {
            String storeId = entry.getKey();
            Order order = new Order();
            order.setUserId(userId);
            order.setStoreId(storeId);
            order.setAddressId(req.getAddressId());
            order.setPaymentMethod(req.getPaymentMethod());
            order.setTotal(totalByStore.get(storeId));
            order.setStatus(OrderStatus.ORDER_PLACED);
            order.setIsPaid(false);

            Order saved = orderRepository.save(order);
            for (OrderItem oi : entry.getValue()) {
                oi.setOrderId(saved.getId());
                oi.setOrder(saved);
                saved.getOrderItems().add(oi);
            }
            Order persisted = orderRepository.save(saved);
            // Log history: trạng thái khởi tạo
            logHistory(persisted.getId(), OrderStatus.ORDER_PLACED, null, userId, "Đơn hàng được tạo");
            created.add(persisted);
        }
        userRepository.findById(userId).ifPresent(user -> {
            user.setCart(new HashMap<>());
            userRepository.save(user);
        });

        return created;
    }

    public Order updateOrderStatus(String id, OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        OrderStatus previous = order.getStatus();
        order.setStatus(status);
        // COD: khi đơn được đánh dấu DELIVERED → coi như đã nhận tiền
        if (status == OrderStatus.DELIVERED && Boolean.FALSE.equals(order.getIsPaid())) {
            order.setIsPaid(true);
        }
        Order saved = orderRepository.save(order);
        // Log history nếu status thực sự đổi
        if (previous != status) {
            logHistory(saved.getId(), status, previous, null, null);
            // Push real-time qua WebSocket
            messagingTemplate.convertAndSend(
                "/topic/orders/" + saved.getId(),
                new OrderStatusMessage(saved.getId(), status.name(), "Trạng thái đơn hàng đã được cập nhật")
            );

            // Tạo thông báo lưu DB + đẩy realtime cho chủ đơn
            notificationService.create(
                saved.getUserId(),
                "ORDER_STATUS",
                status.getNotiTitle(),
                status.getNotiMessage(),
                "/account/orders"
            );
        }
        return saved;
    }

    public Order updatePaymentStatus(String id, boolean isPaid) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setIsPaid(isPaid);
        return orderRepository.save(order);
    }

    public void deleteOrder(String id) {
        orderRepository.deleteById(id);
    }
}
