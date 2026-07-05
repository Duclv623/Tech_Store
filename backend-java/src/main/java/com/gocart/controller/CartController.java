package com.gocart.controller;

import com.gocart.model.User;
import com.gocart.repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CartController {
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getCart(Authentication auth) {
        User user = getCurrentUser(auth);
        return ResponseEntity.ok(normalizeCart(user.getCart()));
    }

    @PutMapping
    public ResponseEntity<Map<String, Object>> updateCart(@RequestBody CartRequest req, Authentication auth) {
        User user = getCurrentUser(auth);
        Map<String, Object> cart = normalizeCart(req.getItems());
        user.setCart(cart);
        userRepository.save(user);
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/merge")
    public ResponseEntity<Map<String, Object>> mergeCart(@RequestBody CartRequest req, Authentication auth) {
        User user = getCurrentUser(auth);
        Map<String, Object> merged = normalizeCart(user.getCart());

        normalizeCart(req.getItems()).forEach((productId, quantity) -> {
            int current = toQuantity(merged.get(productId));
            merged.put(productId, current + toQuantity(quantity));
        });

        user.setCart(merged);
        userRepository.save(user);
        return ResponseEntity.ok(merged);
    }

    @DeleteMapping
    public ResponseEntity<Void> clearCart(Authentication auth) {
        User user = getCurrentUser(auth);
        user.setCart(new HashMap<>());
        userRepository.save(user);
        return ResponseEntity.noContent().build();
    }

    private User getCurrentUser(Authentication auth) {
        if (auth == null || auth.getName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
        }
        return userRepository.findById(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private Map<String, Object> normalizeCart(Map<String, Object> cart) {
        Map<String, Object> normalized = new HashMap<>();
        if (cart == null) return normalized;

        cart.forEach((productId, value) -> {
            int quantity = toQuantity(value);
            if (productId != null && !productId.isBlank() && quantity > 0) {
                normalized.put(productId, quantity);
            }
        });
        return normalized;
    }

    private int toQuantity(Object value) {
        if (value instanceof Number number) {
            return Math.max(0, number.intValue());
        }
        if (value instanceof String text) {
            try {
                return Math.max(0, Integer.parseInt(text));
            } catch (NumberFormatException ignored) {
                return 0;
            }
        }
        return 0;
    }

    @Data
    public static class CartRequest {
        private Map<String, Object> items = new HashMap<>();
    }
}
