package com.gocart.config;

import com.gocart.model.Category;
import com.gocart.model.UserRole;
import com.gocart.repository.CategoryRepository;
import com.gocart.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    @Value("${app.admin.email:}")
    private String adminEmail;

    @Override
    public void run(String... args) {
        seedRoles();
        seedCategories();
    }

    private void seedRoles() {
        // 1. Backfill: user nào chưa có role → set USER, và set emailVerified = true cho user cũ
        userRepository.findAll().stream()
                .forEach(u -> {
                    boolean updated = false;
                    if (u.getRole() == null) {
                        u.setRole(UserRole.USER);
                        updated = true;
                    }
                    if (!u.isEmailVerified()) {
                        u.setEmailVerified(true);
                        updated = true;
                    }
                    if (updated) {
                        userRepository.save(u);
                    }
                });

        // 2. Promote admin email lên ADMIN nếu tồn tại
        if (adminEmail != null && !adminEmail.isBlank()) {
            userRepository.findByEmail(adminEmail).ifPresent(u -> {
                if (u.getRole() != UserRole.ADMIN) {
                    u.setRole(UserRole.ADMIN);
                    userRepository.save(u);
                    log.info("Promoted {} to ADMIN", adminEmail);
                }
            });
        }
    }

    private void seedCategories() {
        if (categoryRepository.count() > 0) return; // chỉ seed khi rỗng

        List<Category> defaults = List.of(
                buildCategory("Laptop", "laptop", "Máy tính xách tay", 1),
                buildCategory("Smartphone", "smartphone", "Điện thoại di động", 2),
                buildCategory("Audio", "audio", "Tai nghe, loa, âm thanh", 3),
                buildCategory("Tablet", "tablet", "Máy tính bảng", 4),
                buildCategory("Accessories", "accessories", "Phụ kiện công nghệ", 5)
        );
        categoryRepository.saveAll(defaults);
        log.info("Seeded {} default categories", defaults.size());
    }

    private Category buildCategory(String name, String slug, String desc, int order) {
        Category c = new Category();
        c.setName(name);
        c.setSlug(slug);
        c.setDescription(desc);
        c.setDisplayOrder(order);
        return c;
    }
}
