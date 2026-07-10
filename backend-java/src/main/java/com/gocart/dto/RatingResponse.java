package com.gocart.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO phẳng cho Rating. userName/userImage lấy từ quan hệ user (lazy) tại thời điểm map,
 * giữ nguyên các field như API cũ trả ra.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RatingResponse {
    private String id;
    private Integer rating;
    private String review;
    private String userId;
    private String productId;
    private String orderId;
    private String userName;
    private String userImage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
