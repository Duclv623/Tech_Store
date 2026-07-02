package com.gocart.repository;

import com.gocart.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

    @Repository
    public interface ProductRepository extends JpaRepository<Product, String> {
        List<Product> findByStoreId(String storeId);
        List<Product> findByCategory(String category);
        List<Product> findByInStockTrue();
        
        @Query("SELECT p FROM Product p ORDER BY p.createdAt DESC")
        List<Product> findLatestProducts();
        
        @Query("SELECT p FROM Product p WHERE p.name LIKE %:keyword% OR p.description LIKE %:keyword%")
        List<Product> searchProducts(String keyword);
    }

