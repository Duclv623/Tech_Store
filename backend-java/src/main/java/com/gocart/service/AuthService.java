package com.gocart.service;

import com.gocart.dto.AuthResponse;
import com.gocart.dto.ChangePasswordRequest;
import com.gocart.dto.ForgotPasswordRequest;
import com.gocart.dto.LoginRequest;
import com.gocart.dto.RegisterRequest;
import com.gocart.dto.ResetPasswordRequest;
import com.gocart.dto.UserProfileResponse;
import com.gocart.model.EmailVerificationToken;
import com.gocart.model.PasswordResetToken;
import com.gocart.model.User;
import com.gocart.repository.EmailVerificationTokenRepository;
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
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final MailService mailService;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use");
        }
        User user = new User();
        user.setId(UUID.randomUUID().toString());
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setEmailVerified(false);
        userRepository.save(user);

        // Tạo token xác thực email
        emailVerificationTokenRepository.deleteByEmail(user.getEmail());
        EmailVerificationToken evt = new EmailVerificationToken();
        evt.setId(UUID.randomUUID().toString());
        evt.setToken(UUID.randomUUID().toString());
        evt.setEmail(user.getEmail());
        evt.setExpiresAt(Instant.now().plus(24, ChronoUnit.HOURS));
        emailVerificationTokenRepository.save(evt);

        // Gửi email xác nhận
        String link = frontendUrl + "/verify-email?token=" + evt.getToken();
        String name = user.getName() == null ? "" : user.getName();
        mailService.send(
                user.getEmail(),
                "Xác minh tài khoản GoCart",
                "Xin chào " + name + ",\n\n"
                        + "Cảm ơn bạn đã đăng ký tài khoản tại GoCart. Vui lòng bấm vào link dưới đây để xác nhận kích hoạt tài khoản của bạn "
                        + "(link hết hạn sau 24 giờ):\n\n"
                        + link + "\n\n"
                        + "Nếu bạn không thực hiện đăng ký này, hãy bỏ qua email này."
        );

        return new AuthResponse(null, UserProfileResponse.from(user));
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        if (!user.isEmailVerified()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Tài khoản chưa được xác minh email. Vui lòng kiểm tra hộp thư để kích hoạt.");
        }

        String token = jwtService.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return new AuthResponse(token, UserProfileResponse.from(user));
    }

    @Transactional
    public void changePassword(String userId, ChangePasswordRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Người dùng không tồn tại"));

        if (!passwordEncoder.matches(req.getCurrentPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu hiện tại không đúng");
        }

        if (passwordEncoder.matches(req.getNewPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Mật khẩu mới phải khác mật khẩu hiện tại");
        }

        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
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

    /**
     * Xác thực email từ token.
     */
    @Transactional
    public void verifyEmail(String token) {
        EmailVerificationToken evt = emailVerificationTokenRepository.findByToken(token)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token xác thực không hợp lệ."));

        if (evt.getExpiresAt().isBefore(Instant.now())) {
            emailVerificationTokenRepository.delete(evt);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token xác thực đã hết hạn.");
        }

        User user = userRepository.findByEmail(evt.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Người dùng không tồn tại."));

        user.setEmailVerified(true);
        userRepository.save(user);

        // Token dùng 1 lần -> xoá sau khi xác thực xong
        emailVerificationTokenRepository.delete(evt);
    }
}
