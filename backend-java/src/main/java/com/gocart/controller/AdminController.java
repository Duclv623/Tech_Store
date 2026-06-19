package com.gocart.controller;

import com.gocart.dto.OrderResponse;
import com.gocart.dto.TopProductDto;
import com.gocart.model.Order;
import com.gocart.model.OrderStatus;
import com.gocart.model.Product;
import com.gocart.repository.OrderItemRepository;
import com.gocart.repository.OrderRepository;
import com.gocart.repository.ProductRepository;
import com.gocart.repository.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final StoreRepository storeRepository;
    private final OrderItemRepository orderItemRepository;

    /**
     * Lấy thống kê tổng quan cho admin dashboard
     * GET /api/admin/dashboard
     */
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Tổng số products
        long totalProducts = productRepository.count();
        stats.put("products", totalProducts);
        
        // Tổng số stores
        long totalStores = storeRepository.count();
        stats.put("stores", totalStores);
        
        // Tổng số orders
        long totalOrders = orderRepository.count();
        stats.put("orders", totalOrders);
        
        // Tổng revenue: chỉ tính đơn đã thanh toán VÀ chưa bị hủy
        List<Order> paidOrders = orderRepository.findByIsPaidTrue();
        double totalRevenue = paidOrders.stream()
                .filter(o -> o.getStatus() != OrderStatus.CANCELLED)
                .mapToDouble(order -> order.getTotal() != null ? order.getTotal() : 0.0)
                .sum();
        stats.put("revenue", totalRevenue);
        
        // Tất cả orders (để vẽ chart) — map sang DTO để tránh recursion
        List<OrderResponse> allOrders = orderRepository.findAll().stream()
                .map(OrderResponse::from)
                .toList();
        stats.put("allOrders", allOrders);

        // Top 5 sản phẩm bán chạy (theo số lượng đã bán, bỏ đơn đã hủy)
        List<TopProductDto> topProducts = orderItemRepository.findTopSelling(PageRequest.of(0, 5));
        // Gán ảnh đại diện cho mỗi sản phẩm
        if (!topProducts.isEmpty()) {
            List<String> ids = topProducts.stream().map(TopProductDto::getProductId).toList();
            Map<String, Product> productMap = productRepository.findAllById(ids).stream()
                    .collect(Collectors.toMap(Product::getId, p -> p));
            topProducts.forEach(tp -> {
                Product p = productMap.get(tp.getProductId());
                if (p != null && p.getImages() != null && !p.getImages().isEmpty()) {
                    tp.setImage(p.getImages().get(0));
                }
            });
        }
        stats.put("topProducts", topProducts);

        return ResponseEntity.ok(stats);
    }
}

