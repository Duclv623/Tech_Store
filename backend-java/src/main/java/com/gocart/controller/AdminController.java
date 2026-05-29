package com.gocart.controller;

import com.gocart.dto.OrderResponse;
import com.gocart.model.Order;
import com.gocart.model.OrderStatus;
import com.gocart.repository.OrderRepository;
import com.gocart.repository.ProductRepository;
import com.gocart.repository.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final StoreRepository storeRepository;

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
        
        return ResponseEntity.ok(stats);
    }
}

