package com.gocart.controller;

import com.gocart.dto.CreateOrderRequest;
import com.gocart.dto.OrderResponse;
import com.gocart.model.Order;
import com.gocart.model.OrderStatus;
import com.gocart.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {
    private final OrderService orderService;

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
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable String id) {
        return orderService.getOrderById(id)
                .map(OrderResponse::from)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderResponse>> getOrdersByUser(@PathVariable String userId) {
        return ResponseEntity.ok(orderService.getOrdersByUser(userId).stream().map(OrderResponse::from).toList());
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<OrderResponse>> getOrdersByStore(@PathVariable String storeId) {
        return ResponseEntity.ok(orderService.getOrdersByStore(storeId).stream().map(OrderResponse::from).toList());
    }

    @GetMapping("/store/{storeId}/status/{status}")
    public ResponseEntity<List<OrderResponse>> getOrdersByStoreAndStatus(
            @PathVariable String storeId,
            @PathVariable OrderStatus status) {
        return ResponseEntity.ok(orderService.getOrdersByStoreAndStatus(storeId, status)
                .stream().map(OrderResponse::from).toList());
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(orderService.createOrder(order));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable String id,
            @RequestBody OrderStatus status) {
        try {
            return ResponseEntity.ok(OrderResponse.from(orderService.updateOrderStatus(id, status)));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/paid")
    public ResponseEntity<OrderResponse> updatePaymentStatus(
            @PathVariable String id,
            @RequestBody Boolean isPaid) {
        try {
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
}
