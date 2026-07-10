package com.gocart.service;

import com.gocart.dto.ProductResponse;
import com.gocart.dto.RatingResponse;
import com.gocart.model.Product;
import com.gocart.model.Rating;
import com.gocart.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {
    private final ProductRepository productRepository;

    @Cacheable(value = "products", key = "'all'")
    public List<ProductResponse> getAllProducts() {
        return toResponseList(productRepository.findAll());
    }

    @Cacheable(value = "product", key = "#id")
    public Optional<ProductResponse> getProductById(String id) {
        return productRepository.findById(id).map(this::toResponse);
    }

    @Cacheable(value = "productsByStore", key = "#storeId")
    public List<ProductResponse> getProductsByStore(String storeId) {
        return toResponseList(productRepository.findByStoreId(storeId));
    }

    @Cacheable(value = "productsByCategory", key = "#category")
    public List<ProductResponse> getProductsByCategory(String category) {
        return toResponseList(productRepository.findByCategory(category));
    }

    @Cacheable(value = "latestProducts", key = "'latest'")
    public List<ProductResponse> getLatestProducts() {
        return toResponseList(productRepository.findLatestProducts());
    }

    public List<Product> searchProducts(String keyword) {
        return productRepository.searchProducts(keyword);
    }

    @Caching(evict = {
            @CacheEvict(value = "products", allEntries = true),
            @CacheEvict(value = "productsByStore", allEntries = true),
            @CacheEvict(value = "productsByCategory", allEntries = true),
            @CacheEvict(value = "latestProducts", allEntries = true)
    })
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    @Caching(evict = {
            @CacheEvict(value = "product", key = "#id"),
            @CacheEvict(value = "products", allEntries = true),
            @CacheEvict(value = "productsByStore", allEntries = true),
            @CacheEvict(value = "productsByCategory", allEntries = true),
            @CacheEvict(value = "latestProducts", allEntries = true)
    })
    public Product updateProduct(String id, Product product) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        existingProduct.setName(product.getName());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setMrp(product.getMrp());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setImages(product.getImages());
        existingProduct.setCategory(product.getCategory());
        existingProduct.setInStock(product.getInStock());
        // Chỉ cập nhật kho khi client thực sự gửi field này (tránh vô tình về null/0)
        if (product.getStockQuantity() != null) {
            existingProduct.setStockQuantity(product.getStockQuantity());
        }

        return productRepository.save(existingProduct);
    }

    @Caching(evict = {
            @CacheEvict(value = "product", key = "#id"),
            @CacheEvict(value = "products", allEntries = true),
            @CacheEvict(value = "productsByStore", allEntries = true),
            @CacheEvict(value = "productsByCategory", allEntries = true),
            @CacheEvict(value = "latestProducts", allEntries = true)
    })
    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }

    // ── Mapping entity -> DTO (list luôn dùng ArrayList để round-trip qua Redis an toàn) ──

    private List<ProductResponse> toResponseList(List<Product> products) {
        return products.stream()
                .map(this::toResponse)
                .collect(Collectors.toCollection(ArrayList::new));
    }

    private ProductResponse toResponse(Product p) {
        List<String> images = p.getImages() == null
                ? new ArrayList<>()
                : new ArrayList<>(p.getImages());
        List<RatingResponse> ratings = p.getRatings() == null
                ? new ArrayList<>()
                : p.getRatings().stream()
                        .map(this::toRatingResponse)
                        .collect(Collectors.toCollection(ArrayList::new));
        return new ProductResponse(
                p.getId(), p.getName(), p.getDescription(), p.getMrp(), p.getPrice(),
                images, p.getCategory(), p.getInStock(), p.getStockQuantity(), p.getStoreId(),
                ratings, p.getCreatedAt(), p.getUpdatedAt());
    }

    private RatingResponse toRatingResponse(Rating r) {
        return new RatingResponse(
                r.getId(), r.getRating(), r.getReview(), r.getUserId(), r.getProductId(),
                r.getOrderId(), r.getUserName(), r.getUserImage(), r.getCreatedAt(), r.getUpdatedAt());
    }
}
