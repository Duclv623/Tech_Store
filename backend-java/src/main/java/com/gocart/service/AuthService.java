package com.gocart.service;

import com.gocart.dto.AuthResponse;
import com.gocart.dto.ForgotPasswordRequest;
import com.gocart.dto.LoginRequest;
import com.gocart.dto.RegisterRequest;
import com.gocart.dto.ResetPasswordRequest;
import com.gocart.dto.UserProfileResponse;
import com.gocart.model.PasswordResetToken;
import com.gocart.model.User;
import com.gocart.repository.PasswordResetTokenRepository;
import com.gocart.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final MailService mailService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public AuthResponse register(RegisterRequest req) {
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
        }
        User user = new User();
        user.setId(UUID.randomUUID().toString());
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        userRepository.save(user);

        String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return new AuthResponse(token, UserProfileResponse.from(user));
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return new AuthResponse(token, UserProfileResponse.from(user));
    }

    /**
     * Tạo token đặt lại mật khẩu và gửi link qua email.
     * Luôn trả về thành công dù email có tồn tại hay không, để không lộ
     * thông tin email nào đã đăng ký (chống dò tài khoản).
     */
    @Transactional
    public void forgotPassword(ForgotPasswordRequest req) {
        Optional<User> userOpt = userRepository.findByEmail(req.getEmail());
        if (userOpt.isEmpty()) {
            return;
        }
        User user = userOpt.get();

        // Xoá token cũ (nếu có) để mỗi email chỉ có 1 token hiệu lực
        tokenRepository.deleteByEmail(user.getEmail());

        PasswordResetToken prt = new PasswordResetToken();
        prt.setId(UUID.randomUUID().toString());
        prt.setToken(UUID.randomUUID().toString());
        prt.setEmail(user.getEmail());
        prt.setExpiresAt(Instant.now().plus(30, ChronoUnit.MINUTES));
        tokenRepository.save(prt);

        String link = frontendUrl + "/reset-password?token=" + prt.getToken();
        String name = user.getName() == null ? "" : user.getName();
        mailService.send(
                user.getEmail(),
                "Đặt lại mật khẩu GoCart",
                "Xin chào " + name + ",\n\n"
                        + "Bạn vừa yêu cầu đặt lại mật khẩu. Bấm vào link dưới đây để đặt mật khẩu mới "
                        + "(link hết hạn sau 30 phút):\n\n"
                        + link + "\n\n"
                        + "Nếu bạn không yêu cầu việc này, hãy bỏ qua email này."
        );
    }

    /**
     * Kiểm tra token còn hiệu lực và đặt lại mật khẩu mới.
     */
    @Transactional
    public void resetPassword(ResetPasswordRequest req) {
        PasswordResetToken prt = tokenRepository.findByToken(req.getToken())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token không hợp lệ"));

        if (prt.getExpiresAt().isBefore(Instant.now())) {
            tokenRepository.delete(prt);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token đã hết hạn");
        }

        User user = userRepository.findByEmail(prt.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Người dùng không tồn tại"));

        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);

        // Token dùng 1 lần -> xoá sau khi đổi xong
        tokenRepository.delete(prt);
    }
}
