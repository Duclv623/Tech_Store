package com.gocart.controller;

import com.gocart.model.Notification;
import com.gocart.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class NotificationController {

    private final NotificationService notificationService;

    // Lấy toàn bộ thông báo của user đang đăng nhập
    @GetMapping
    public ResponseEntity<List<Notification>> getMyNotifications(Authentication auth) {
        String userId = (String) auth.getPrincipal();
        return ResponseEntity.ok(notificationService.getByUserId(userId));
    }

    // Đếm số thông báo chưa đọc (cho badge trên chuông)
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Object>> getUnreadCount(Authentication auth) {
        String userId = (String) auth.getPrincipal();
        return ResponseEntity.ok(Map.of("count", notificationService.countUnread(userId)));
    }

    // Đánh dấu 1 thông báo đã đọc
    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable String id, Authentication auth) {
        notificationService.markAsRead(id);
        return ResponseEntity.noContent().build();
    }

    // Đánh dấu tất cả đã đọc
    @PatchMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(Authentication auth) {
        String userId = (String) auth.getPrincipal();
        notificationService.markAllAsRead(userId);
        return ResponseEntity.noContent().build();
    }
}
