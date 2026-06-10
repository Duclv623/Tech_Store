package com.gocart.repository;

import com.gocart.model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, String> {
    boolean existsByUserIdAndProductId(String userId, String productId);
    List<Wishlist> findByUserId(String userId);
    Optional<Wishlist> findByUserIdAndProductId(String userId, String productId);

    @Transactional
    void deleteByUserIdAndProductId(String userId, String productId);
}