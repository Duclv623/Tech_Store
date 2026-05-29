package com.gocart.repository;

import com.gocart.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, String> {
    List<Rating> findByProductId(String productId);
    List<Rating> findByUserId(String userId);
    Optional<Rating> findByUserIdAndProductIdAndOrderId(String userId, String productId, String orderId);

    @Query("SELECT r FROM Rating r WHERE r.product.storeId = :storeId ORDER BY r.createdAt DESC")
    List<Rating> findByStoreId(String storeId);
}

