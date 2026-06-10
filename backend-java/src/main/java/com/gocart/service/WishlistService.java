package com.gocart.service;

import com.gocart.model.Wishlist;
import com.gocart.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class WishlistService {

    private final WishlistRepository wishlistRepository;

    public List<Wishlist> getByUserId(String userId) {
        return wishlistRepository.findByUserId(userId);
    }

    public Map<String, Object> toggle(String userId, String productId) {
        if (wishlistRepository.existsByUserIdAndProductId(userId, productId)) {
            wishlistRepository.deleteByUserIdAndProductId(userId, productId);
            return Map.of("added", false, "productId", productId);
        } else {
            Wishlist wishlist = new Wishlist();
            wishlist.setUserId(userId);
            wishlist.setProductId(productId);
            wishlistRepository.save(wishlist);
            return Map.of("added", true, "productId", productId);
        }
    }

    public boolean isWishlisted(String userId, String productId) {
        return wishlistRepository.existsByUserIdAndProductId(userId, productId);
    }
}
