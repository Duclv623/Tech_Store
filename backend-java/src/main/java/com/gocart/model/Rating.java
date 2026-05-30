package com.gocart.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "Rating", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"userId", "productId", "orderId"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Rating {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;
    
    private Integer rating;
    
    @Column(columnDefinition = "TEXT")
    private String review;
    
    private String userId;
    private String productId;
    private String orderId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "userId", insertable = false, updatable = false)
    @JsonIgnore
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "productId", insertable = false, updatable = false)
    @JsonIgnore
    private Product product;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @Transient
    @JsonProperty("userName")
    public String getUserName() {
        return user != null ? user.getName() : null;
    }

    @Transient
    @JsonProperty("userImage")
    public String getUserImage() {
        return user != null ? user.getImage() : null;
    }
}

