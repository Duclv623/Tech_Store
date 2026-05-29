package com.gocart.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "OrderStatusHistory", indexes = {
        @Index(name = "idx_osh_order_id", columnList = "orderId"),
        @Index(name = "idx_osh_created_at", columnList = "createdAt")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class OrderStatusHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String orderId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    /** Status trước đó. Null nếu là history đầu tiên (lúc đặt đơn). */
    @Enumerated(EnumType.STRING)
    private OrderStatus previousStatus;

    /** User đã đổi status (admin/seller). Null nếu là system. */
    private String changedByUserId;

    /** Ghi chú thêm. Null nếu không có. */
    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
