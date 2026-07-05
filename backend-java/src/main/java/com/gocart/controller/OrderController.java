package com.gocart.controller;

import com.gocart.dto.CreateOrderRequest;
import com.gocart.dto.OrderResponse;
import com.gocart.model.Order;
import com.gocart.model.OrderStatus;
import com.gocart.model.Store;
import com.gocart.repository.StoreRepository;
import com.gocart.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {
    private final OrderService orderService;
    private final StoreRepository storeRepository;

    @GetMapping("/me")
    public ResponseEntity<?> getMyOrders(Authentication auth) {
        if (auth == null || auth.getName() == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        List<OrderResponse> list = orderService.getOrdersByUser(auth.getName())
                .stream().map(OrderResponse::from).toList();
        return ResponseEntity.ok(list);
    }

    @PostMapping("/place")
    public ResponseEntity<?> placeOrder(@RequestBody CreateOrderRequest req, Authentication auth) {
        if (auth == null || auth.getName() == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        List<OrderResponse> created = orderService.placeOrder(auth.getName(), req)
                .stream().map(OrderResponse::from).toList();
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders().stream().map(OrderResponse::from).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable String id, Authentication auth) {
        Order order = orderService.getOrderById(id).orElse(null);
        if (order == null) return ResponseEntity.notFound().build();
        if (!canViewOrder(auth, order)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bạn không có quyền xem đơn hàng này");
        }
        return ResponseEntity.ok(OrderResponse.from(order));
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<?> getOrderHistory(@PathVariable String id, Authentication auth) {
        Order order = orderService.getOrderById(id).orElse(null);
        if (order == null) return ResponseEntity.notFound().build();
        if (!canViewOrder(auth, order)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bạn không có quyền xem đơn hàng này");
        }
        return ResponseEntity.ok(orderService.getOrderHistory(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getOrdersByUser(@PathVariable String userId, Authentication auth) {
        if (auth == null || auth.getName() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }
        boolean isAdmin = auth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
        if (!isAdmin && !userId.equals(auth.getName())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bạn không có quyền xem đơn hàng của người dùng này");
        }
        return ResponseEntity.ok(orderService.getOrdersByUser(userId).stream().map(OrderResponse::from).toList());
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<?> getOrdersByStore(@PathVariable String storeId, Authentication auth) {
        if (!isStoreOwnerOrAdmin(auth, storeId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bạn không có quyền xem đơn hàng của cửa hàng này");
        }
        return ResponseEntity.ok(orderService.getOrdersByStore(storeId).stream().map(OrderResponse::from).toList());
    }

    @GetMapping("/store/{storeId}/status/{status}")
    public ResponseEntity<?> getOrdersByStoreAndStatus(
            @PathVariable String storeId,
            @PathVariable OrderStatus status,
            Authentication auth) {
        if (!isStoreOwnerOrAdmin(auth, storeId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bạn không có quyền xem đơn hàng của cửa hàng này");
        }
        return ResponseEntity.ok(orderService.getOrdersByStoreAndStatus(storeId, status)
                .stream().map(OrderResponse::from).toList());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable String id,
            @RequestBody OrderStatus status,
            Authentication auth) {
        try {
            Order order = orderService.getOrderById(id).orElse(null);
            if (order == null) return ResponseEntity.notFound().build();
            if (!isStoreOwnerOrAdmin(auth, order.getStoreId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bạn không có quyền cập nhật đơn hàng này");
            }
            return ResponseEntity.ok(OrderResponse.from(orderService.updateOrderStatus(id, status)));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/paid")
    public ResponseEntity<?> updatePaymentStatus(
            @PathVariable String id,
            @RequestBody Boolean isPaid,
            Authentication auth) {
        try {
            Order order = orderService.getOrderById(id).orElse(null);
            if (order == null) return ResponseEntity.notFound().build();
            if (!isStoreOwnerOrAdmin(auth, order.getStoreId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bạn không có quyền cập nhật đơn hàng này");
            }
            return ResponseEntity.ok(OrderResponse.from(
                    orderService.updatePaymentStatus(id, Boolean.TRUE.equals(isPaid))));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable String id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    private boolean isStoreOwnerOrAdmin(Authentication auth, String storeId) {
        if (auth == null) return false;
        if (auth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) return true;
        Store store = storeRepository.findById(storeId).orElse(null);
        return store != null && store.getUserId().equals(auth.getName());
    }

    /** Được xem đơn nếu là: chủ đơn, chủ store của đơn, hoặc admin. */
    private boolean canViewOrder(Authentication auth, Order order) {
        if (auth == null || auth.getName() == null || order == null) return false;
        if (auth.getName().equals(order.getUserId())) return true;
        return isStoreOwnerOrAdmin(auth, order.getStoreId());
    }
}
