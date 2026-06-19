package com.gocart.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Thống kê sản phẩm bán chạy cho admin dashboard.
 * Constructor 4 tham số được JPQL dùng (xem OrderItemRepository); ảnh được gán sau.
 */
@Data
@NoArgsConstructor
public class TopProductDto {
    private String productId;
    private String name;
    private Long totalSold;
    private Double revenue;
    private String image;

    public TopProductDto(String productId, String name, Long totalSold, Double revenue) {
        this.productId = productId;
        this.name = name;
        this.totalSold = totalSold;
        this.revenue = revenue;
    }
}
