package com.gocart.controller;

import com.gocart.service.MinioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/upload")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UploadController {

    private final MinioService minioService;

    /** Upload 1 ảnh -> trả về { "url": "http://localhost:9000/gocart/..." } */
    @PostMapping
    public ResponseEntity<Map<String, String>> upload(@RequestParam("file") MultipartFile file) {
        String url = minioService.upload(file);
        return ResponseEntity.ok(Map.of("url", url));
    }
}
