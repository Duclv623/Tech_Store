package com.gocart;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class GoCartApplication {
    public static void main(String[] args) {
        SpringApplication.run(GoCartApplication.class, args);
    }
}

