package com.gocart.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO phẳng cho Product khi cache vào Redis / trả ra API.
 * Không dùng entity trực tiếp để tránh Hibernate PersistentBag (lazy collection)
 * khiến JSON serialize/deserialize thất bại.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private String id;
    private String name;
    private String description;
    private Double mrp;
    private Double price;
    private List<String> images;
    private String category;
    private Boolean inStock;
    private Integer stockQuantity;
    private String storeId;
    // Giữ nguyên tên field "rating" như API cũ (Product entity dùng @JsonProperty("rating"))
    @JsonProperty("rating")
    private List<RatingResponse> ratings;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
