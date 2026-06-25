package com.gocart.controller;

import com.gocart.model.Order;
import com.gocart.model.OrderStatus;
import com.gocart.model.Rating;
import com.gocart.model.Store;
import com.gocart.model.User;
import com.gocart.repository.OrderRepository;
import com.gocart.repository.ProductRepository;
import com.gocart.repository.RatingRepository;
import com.gocart.repository.UserRepository;
import com.gocart.service.StoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

@RestController
@RequestMapping("/api/stores")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StoreController {
    private final StoreService storeService;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final RatingRepository ratingRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Store>> getAllStores() {
        return ResponseEntity.ok(storeService.getAllStores());
    }

    @GetMapping("/active")
    public ResponseEntity<List<Store>> getActiveStores() {
        return ResponseEntity.ok(storeService.getActiveStores());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Store>> getStoresByStatus(@PathVariable String status) {
        return ResponseEntity.ok(storeService.getStoresByStatus(status));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Store> getStoreById(@PathVariable String id) {
        return storeService.getStoreById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<Store> getStoreByUsername(@PathVariable String username) {
        return storeService.getStoreByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Store> getStoreByUserId(@PathVariable String userId) {
        return storeService.getStoreByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Dashboard cho seller — tổng hợp số liệu của cửa hàng đang đăng nhập.
     * GET /api/stores/me/dashboard
     */
    @GetMapping("/me/dashboard")
    public ResponseEntity<?> getMyStoreDashboard(Authentication auth) {
        if (auth == null || auth.getName() == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        Store store = storeService.getStoreByUserId(auth.getName()).orElse(null);
        if (store == null) {
            return ResponseEntity.status(404).body("Bạn chưa có cửa hàng");
        }

        long totalProducts = productRepository.findByStoreId(store.getId()).size();
        List<Order> orders = orderRepository.findByStoreId(store.getId());
        long totalOrders = orders.size();

        double totalEarnings = orders.stream()
                .filter(o -> Boolean.TRUE.equals(o.getIsPaid()) && o.getStatus() != OrderStatus.CANCELLED)
                .mapToDouble(o -> o.getTotal() != null ? o.getTotal() : 0.0)
                .sum();

        List<Rating> ratings = ratingRepository.findByStoreId(store.getId());

        // Map ratings → DTO bao gồm user.name/image (vì Rating.user bị @JsonIgnore)
        List<Map<String, Object>> ratingDtos = ratings.stream().map(r -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", r.getId());
            m.put("rating", r.getRating());
            m.put("review", r.getReview());
            m.put("createdAt", r.getCreatedAt());
            if (r.getProduct() != null) {
                Map<String, Object> p = new HashMap<>();
                p.put("id", r.getProduct().getId());
                p.put("name", r.getProduct().getName());
                p.put("category", r.getProduct().getCategory());
                p.put("images", r.getProduct().getImages());
                m.put("product", p);
            }
            User u = userRepository.findById(r.getUserId()).orElse(null);
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("name", u != null ? u.getName() : "Khách hàng");
            userInfo.put("image", u != null ? u.getImage() : null);
            m.put("user", userInfo);
            return m;
        }).toList();

        Map<String, Object> resp = new HashMap<>();
        resp.put("storeId", store.getId());
        resp.put("storeName", store.getName());
        resp.put("totalProducts", totalProducts);
        resp.put("totalOrders", totalOrders);
        resp.put("totalEarnings", totalEarnings);
        resp.put("ratings", ratingDtos);
        return ResponseEntity.ok(resp);
    }

    @PostMapping
    public ResponseEntity<?> createStore(@RequestBody Store store, Authentication auth) {
        if (auth == null) return ResponseEntity.status(401).body("Unauthorized");
        // Gán userId = người đang login (không cho tạo store cho người khác)
        store.setUserId(auth.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(storeService.createStore(store));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateStore(@PathVariable String id, @RequestBody Store store, Authentication auth) {
        return storeService.getStoreById(id).map(existing -> {
            if (!isOwnerOrAdmin(auth, existing)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body((Object) "Bạn không có quyền sửa cửa hàng này");
            }
            return ResponseEntity.ok((Object) storeService.updateStore(id, store));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStore(@PathVariable String id, Authentication auth) {
        return storeService.getStoreById(id).map(existing -> {
            if (!isOwnerOrAdmin(auth, existing)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bạn không có quyền xóa cửa hàng này");
            }
            storeService.deleteStore(id);
            return ResponseEntity.noContent().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<?> toggleStoreStatus(@PathVariable String id, Authentication auth) {
        if (!isAdmin(auth)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Chỉ admin mới được thay đổi trạng thái cửa hàng");
        }
        try {
            return ResponseEntity.ok(storeService.toggleStoreStatus(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStoreStatus(
            @PathVariable String id,
            @RequestParam String status,
            Authentication auth) {
        if (!isAdmin(auth)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Chỉ admin mới được thay đổi trạng thái cửa hàng");
        }
        try {
            return ResponseEntity.ok(storeService.updateStoreStatus(id, status));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    private boolean isAdmin(Authentication auth) {
        return auth != null && auth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"));
    }

    private boolean isOwnerOrAdmin(Authentication auth, Store store) {
        if (auth == null) return false;
        if (isAdmin(auth)) return true;
        return store.getUserId().equals(auth.getName());
    }
}

