package com.gocart.controller;

import com.gocart.model.Product;
import com.gocart.model.Store;
import com.gocart.repository.StoreRepository;
import com.gocart.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductController {
    private final ProductService productService;
    private final StoreRepository storeRepository;

    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable String id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/store/{storeId}")
    public ResponseEntity<List<Product>> getProductsByStore(@PathVariable String storeId) {
        return ResponseEntity.ok(productService.getProductsByStore(storeId));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(productService.getProductsByCategory(category));
    }

    @GetMapping("/latest")
    public ResponseEntity<List<Product>> getLatestProducts() {
        return ResponseEntity.ok(productService.getLatestProducts());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String keyword) {
        return ResponseEntity.ok(productService.searchProducts(keyword));
    }

    @PostMapping
    public ResponseEntity<?> createProduct(@RequestBody Product product, Authentication auth) {
        if (!isOwnerOrAdmin(auth, product.getStoreId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bạn không có quyền thêm sản phẩm cho cửa hàng này");
        }
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(productService.createProduct(product));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable String id, @RequestBody Product product, Authentication auth) {
        return productService.getProductById(id).map(existing -> {
            if (!isOwnerOrAdmin(auth, existing.getStoreId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body((Object) "Bạn không có quyền sửa sản phẩm này");
            }
            return ResponseEntity.ok((Object) productService.updateProduct(id, product));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable String id, Authentication auth) {
        return productService.getProductById(id).map(existing -> {
            if (!isOwnerOrAdmin(auth, existing.getStoreId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bạn không có quyền xóa sản phẩm này");
            }
            productService.deleteProduct(id);
            return ResponseEntity.noContent().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    /** Kiểm tra user hiện tại có phải chủ store hoặc ADMIN không */
    private boolean isOwnerOrAdmin(Authentication auth, String storeId) {
        if (auth == null) return false;
        if (auth.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_ADMIN"))) return true;
        Store store = storeRepository.findById(storeId).orElse(null);
        return store != null && store.getUserId().equals(auth.getName());
    }
}


