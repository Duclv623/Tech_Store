package com.gocart.repository;

import com.gocart.dto.TopProductDto;
import com.gocart.model.OrderItem;
import com.gocart.model.OrderItemId;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItem, OrderItemId> {

    /**
     * Top sản phẩm bán chạy: tổng số lượng & doanh thu theo sản phẩm,
     * bỏ qua đơn đã hủy, lọc theo khoảng thời gian (from/to có thể null = không giới hạn).
     * Dùng Pageable để giới hạn top N.
     */
    @Query("SELECT new com.gocart.dto.TopProductDto(oi.product.id, oi.product.name, " +
            "SUM(oi.quantity), SUM(oi.quantity * oi.price)) " +
            "FROM OrderItem oi " +
            "WHERE oi.order.status <> com.gocart.model.OrderStatus.CANCELLED " +
            "AND (:from IS NULL OR oi.order.createdAt >= :from) " +
            "AND (:to IS NULL OR oi.order.createdAt <= :to) " +
            "GROUP BY oi.product.id, oi.product.name " +
            "ORDER BY SUM(oi.quantity) DESC")
    List<TopProductDto> findTopSelling(@Param("from") LocalDateTime from,
                                       @Param("to") LocalDateTime to,
                                       Pageable pageable);
}
