package com.gocart.controller;

import com.gocart.model.Wishlist;
import com.gocart.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class WishlistController {

    private final WishlistService wishlistService;

    // Lấy toàn bộ wishlist của user đang đăng nhập
    @GetMapping
    public ResponseEntity<List<Wishlist>> getMyWishlist(Authentication auth) {
        String userId = (String) auth.getPrincipal();
        return ResponseEntity.ok(wishlistService.getByUserId(userId));
    }

    // Toggle thêm / bỏ sản phẩm khỏi wishlist
    @PostMapping("/toggle/{productId}")
    public ResponseEntity<Map<String, Object>> toggle(
            @PathVariable String productId,
            Authentication auth) {
        String userId = (String) auth.getPrincipal();
        return ResponseEntity.ok(wishlistService.toggle(userId, productId));
    }

    // Kiểm tra 1 sản phẩm có đang được yêu thích không
    @GetMapping("/check/{productId}")
    public ResponseEntity<Map<String, Object>> check(
            @PathVariable String productId,
            Authentication auth) {
        String userId = (String) auth.getPrincipal();
        boolean wishlisted = wishlistService.isWishlisted(userId, productId);
        return ResponseEntity.ok(Map.of("wishlisted", wishlisted, "productId", productId));
    }
}
