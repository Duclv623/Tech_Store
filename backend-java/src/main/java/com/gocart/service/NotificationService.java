package com.gocart.service;

import com.gocart.model.Notification;
import com.gocart.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service                    // ① Đánh dấu đây là 1 service, Spring tự quản lý
@RequiredArgsConstructor    // ② Lombok tự tạo constructor cho các field "final" → tự inject
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final SimpMessagingTemplate messagingTemplate;   // ③ để đẩy realtime

    // Tạo thông báo mới: lưu DB + bắn realtime cho đúng user
    public Notification create(String userId, String type, String title, String message, String link) {
        Notification n = new Notification();
        n.setUserId(userId);
        n.setType(type);
        n.setTitle(title);
        n.setMessage(message);
        n.setLink(link);
        Notification saved = notificationRepository.save(n);

        // ④ Đẩy bản ghi vừa lưu tới riêng user này
        messagingTemplate.convertAndSend("/topic/notifications/" + userId, saved);
        return saved;
    }

    // Lấy danh sách thông báo của user (mới nhất trước)
    public List<Notification> getByUserId(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    // Đếm số chưa đọc (cho badge)
    public long countUnread(String userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    // Đánh dấu 1 thông báo đã đọc
    public void markAsRead(String id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setRead(true);
            notificationRepository.save(n);
        });
    }

    // Đánh dấu TẤT CẢ đã đọc
    public void markAllAsRead(String userId) {
        List<Notification> list = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        list.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(list);
    }
}
