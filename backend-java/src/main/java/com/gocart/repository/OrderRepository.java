package com.gocart.repository;

import com.gocart.model.Order;
import com.gocart.model.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
    List<Order> findByUserId(String userId);
    List<Order> findByStoreId(String storeId);
    List<Order> findByStoreIdAndStatus(String storeId, OrderStatus status);
    List<Order> findByIsPaidTrue();

    /**
     * Đơn hàng trong khoảng [from, to], sắp xếp theo thời gian tạo tăng dần (tiện vẽ chart).
     * Lọc ngày ngay trong DB thay vì tải toàn bộ rồi lọc bằng Java.
     * Khi không lọc, controller truyền mốc rất rộng (1970..2999) để tránh tham số null.
     */
    @Query("SELECT o FROM Order o WHERE o.createdAt >= :from AND o.createdAt <= :to ORDER BY o.createdAt ASC")
    List<Order> findByCreatedAtBetween(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);
}

