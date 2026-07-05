package com.gocart.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Product")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "orderItems", "store"})
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private Double mrp;
    private Double price;
    
    @ElementCollection
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image")
    private List<String> images = new ArrayList<>();
    
    private String category;
    private Boolean inStock = true;

    /**
     * Số lượng còn trong kho. Trừ dần mỗi khi đặt hàng; = 0 thì hết hàng.
     * Để nullable ở tầng entity để Hibernate (ddl-auto=update) thêm cột được trên DB có sẵn dữ liệu;
     * ràng buộc NOT NULL + backfill do db/patch-stock-quantity.sql đảm nhiệm.
     */
    private Integer stockQuantity = 0;

    private String storeId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "storeId", insertable = false, updatable = false)
    private Store store;
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<OrderItem> orderItems = new ArrayList<>();
    
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonProperty("rating")
    private List<Rating> ratings = new ArrayList<>();
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

