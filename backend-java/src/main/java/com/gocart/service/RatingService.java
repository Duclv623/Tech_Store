package com.gocart.service;

import com.gocart.model.Rating;
import com.gocart.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class RatingService {
    private final RatingRepository ratingRepository;

    public List<Rating> getRatingsByProduct(String productId) {
        return ratingRepository.findByProductId(productId);
    }

    public List<Rating> getRatingsByUser(String userId) {
        return ratingRepository.findByUserId(userId);
    }

    public Optional<Rating> getRating(String userId, String productId, String orderId) {
        return ratingRepository.findByUserIdAndProductIdAndOrderId(userId, productId, orderId);
    }

    public Rating createRating(Rating rating) {
        Optional<Rating> existing = ratingRepository.findByUserIdAndProductIdAndOrderId(
                rating.getUserId(), rating.getProductId(), rating.getOrderId());

        Rating existingRating = existing.orElse(rating);
        existingRating.setRating(rating.getRating());
        existingRating.setReview(rating.getReview());

        return ratingRepository.save(existingRating);
    }

    public void deleteRating(String id) {
        ratingRepository.deleteById(id);
    }
}

