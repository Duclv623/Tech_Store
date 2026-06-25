package com.gocart.dto;

import com.gocart.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    private String id;
    private String name;
    private String email;
    private String image;
    private String phone;
    private String bio;
    private String address;
    private String role;

    public static UserProfileResponse from(User u) {
        return new UserProfileResponse(
                u.getId(),
                u.getName(),
                u.getEmail(),
                u.getImage(),
                u.getPhone(),
                u.getBio(),
                u.getAddress(),
                u.getRole() != null ? u.getRole().name() : "USER"
        );
    }
}
