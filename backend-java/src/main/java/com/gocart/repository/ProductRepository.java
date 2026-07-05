package com.gocart.repository;

import com.gocart.model.Product;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

    @Repository
    public interface ProductRepository extends JpaRepository<Product, String> {
        List<Product> findByStoreId(String storeId);
        List<Product> findByCategory(String category);
        List<Product> findByInStockTrue();

        /** Khóa hàng để trừ kho an toàn khi nhiều đơn đặt cùng lúc (SELECT ... FOR UPDATE). */
        @Lock(LockModeType.PESSIMISTIC_WRITE)
        @Query("SELECT p FROM Product p WHERE p.id = :id")
        Optional<Product> findByIdForUpdate(@Param("id") String id);

        @Query("SELECT p FROM Product p ORDER BY p.createdAt DESC")
        List<Product> findLatestProducts();
        
        @Query("SELECT p FROM Product p WHERE p.name LIKE %:keyword% OR p.description LIKE %:keyword%")
        List<Product> searchProducts(String keyword);
    }

