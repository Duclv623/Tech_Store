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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
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
     * Thống kê tổng quan cho admin dashboard, có lọc theo khoảng thời gian.
     * GET /api/admin/dashboard?from=YYYY-MM-DD&to=YYYY-MM-DD
     * from/to là tùy chọn; bỏ trống = không giới hạn (toàn bộ thời gian).
     * Các chỉ số theo thời gian (đơn hàng, doanh thu, biểu đồ, sản phẩm bán chạy)
     * được lọc theo khoảng; tổng số sản phẩm/cửa hàng giữ nguyên là tổng toàn hệ thống.
     */
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardStats(
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to) {

        final LocalDateTime fromDt = (from != null && !from.isBlank())
                ? LocalDate.parse(from).atStartOfDay() : null;
        final LocalDateTime toDt = (to != null && !to.isBlank())
                ? LocalDate.parse(to).atTime(LocalTime.MAX) : null;

        Map<String, Object> stats = new HashMap<>();

        // Tổng số sản phẩm / cửa hàng — tổng toàn hệ thống (không theo thời gian)
        stats.put("products", productRepository.count());
        stats.put("stores", storeRepository.count());

        // Lọc đơn hàng theo khoảng thời gian
        List<Order> orders = orderRepository.findAll().stream()
                .filter(o -> inRange(o.getCreatedAt(), fromDt, toDt))
                .toList();

        // Số đơn trong khoảng
        stats.put("orders", orders.size());

        // Doanh thu: đơn đã thanh toán & chưa hủy, trong khoảng
        double revenue = orders.stream()
                .filter(o -> Boolean.TRUE.equals(o.getIsPaid()))
                .filter(o -> o.getStatus() != OrderStatus.CANCELLED)
                .mapToDouble(o -> o.getTotal() != null ? o.getTotal() : 0.0)
                .sum();
        stats.put("revenue", revenue);

        // Tất cả đơn trong khoảng (để vẽ chart) — map sang DTO tránh recursion
        List<OrderResponse> allOrders = orders.stream()
                .map(OrderResponse::from)
                .toList();
        stats.put("allOrders", allOrders);

        // Top 5 sản phẩm bán chạy trong khoảng (bỏ đơn đã hủy)
        List<TopProductDto> topProducts = orderItemRepository.findTopSelling(fromDt, toDt, PageRequest.of(0, 5));
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

    private boolean inRange(LocalDateTime when, LocalDateTime from, LocalDateTime to) {
        if (when == null) return false;
        if (from != null && when.isBefore(from)) return false;
        if (to != null && when.isAfter(to)) return false;
        return true;
    }
}
