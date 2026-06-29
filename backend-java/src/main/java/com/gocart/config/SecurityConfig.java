package com.gocart.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
               .cors(org.springframework.security.config.Customizer.withDefaults())
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // ── Admin ──
                        .requestMatchers(new AntPathRequestMatcher("/api/admin/**")).hasRole("ADMIN")

                        // ── Auth ──
                        .requestMatchers(new AntPathRequestMatcher("/api/auth/change-password")).authenticated()
                        .requestMatchers(new AntPathRequestMatcher("/api/auth/**")).permitAll()

                        // ── Categories: GET public, CUD admin only ──
                        .requestMatchers(new AntPathRequestMatcher("/api/categories/**", HttpMethod.GET.name())).permitAll()
                        .requestMatchers(new AntPathRequestMatcher("/api/categories/**", HttpMethod.POST.name())).hasRole("ADMIN")
                        .requestMatchers(new AntPathRequestMatcher("/api/categories/**", HttpMethod.PUT.name())).hasRole("ADMIN")
                        .requestMatchers(new AntPathRequestMatcher("/api/categories/**", HttpMethod.DELETE.name())).hasRole("ADMIN")

                        // ── Coupons: GET public, CUD admin only ──
                        .requestMatchers(new AntPathRequestMatcher("/api/coupons/public")).permitAll()
                        .requestMatchers(new AntPathRequestMatcher("/api/coupons/**", HttpMethod.POST.name())).hasRole("ADMIN")
                        .requestMatchers(new AntPathRequestMatcher("/api/coupons/**", HttpMethod.PUT.name())).hasRole("ADMIN")
                        .requestMatchers(new AntPathRequestMatcher("/api/coupons/**", HttpMethod.DELETE.name())).hasRole("ADMIN")

                        // ── Users: profile = authenticated, list/CUD = admin ──
                        .requestMatchers(new AntPathRequestMatcher("/api/users/profile")).authenticated()
                        .requestMatchers(new AntPathRequestMatcher("/api/users/profile", HttpMethod.PUT.name())).authenticated()
                        .requestMatchers(new AntPathRequestMatcher("/api/users/**", HttpMethod.GET.name())).hasRole("ADMIN")
                        .requestMatchers(new AntPathRequestMatcher("/api/users/**", HttpMethod.POST.name())).hasRole("ADMIN")
                        .requestMatchers(new AntPathRequestMatcher("/api/users/**", HttpMethod.PUT.name())).hasRole("ADMIN")
                        .requestMatchers(new AntPathRequestMatcher("/api/users/**", HttpMethod.DELETE.name())).hasRole("ADMIN")

                        // ── Orders: own orders = authenticated, list all / delete = admin ──
                        .requestMatchers(new AntPathRequestMatcher("/api/orders/me")).authenticated()
                        .requestMatchers(new AntPathRequestMatcher("/api/orders/place", HttpMethod.POST.name())).authenticated()
                        .requestMatchers(new AntPathRequestMatcher("/api/orders", HttpMethod.GET.name())).hasRole("ADMIN")
                        .requestMatchers(new AntPathRequestMatcher("/api/orders/**", HttpMethod.DELETE.name())).hasRole("ADMIN")

                        // ── Products: GET public, CUD authenticated (ownership checked in controller) ──
                        .requestMatchers(new AntPathRequestMatcher("/api/products/**", HttpMethod.GET.name())).permitAll()
                        .requestMatchers(new AntPathRequestMatcher("/api/products/**", HttpMethod.POST.name())).authenticated()
                        .requestMatchers(new AntPathRequestMatcher("/api/products/**", HttpMethod.PUT.name())).authenticated()
                        .requestMatchers(new AntPathRequestMatcher("/api/products/**", HttpMethod.DELETE.name())).authenticated()

                        // ── Stores: GET public, CUD authenticated (ownership checked in controller) ──
                        .requestMatchers(new AntPathRequestMatcher("/api/stores/**", HttpMethod.GET.name())).permitAll()

                        // ── Upload ảnh: cần đăng nhập ──
                        .requestMatchers(new AntPathRequestMatcher("/api/upload/**", HttpMethod.POST.name())).authenticated()

                        // ── WebSocket & infra ──
                        .requestMatchers(new AntPathRequestMatcher("/ws/**")).permitAll()
                        .requestMatchers(new AntPathRequestMatcher("/actuator/health")).permitAll()
                        .requestMatchers(new AntPathRequestMatcher("/error")).permitAll()
                        .requestMatchers(new AntPathRequestMatcher("/**", HttpMethod.OPTIONS.name())).permitAll()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
