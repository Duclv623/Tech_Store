package com.gocart.dto;

import com.gocart.model.PaymentMethod;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class CreateOrderRequest {
    private String addressId;
    private PaymentMethod paymentMethod;
    private String couponCode;
    private List<Item> items;

    @Data
    @NoArgsConstructor
    public static class Item {
        private String productId;
        private Integer quantity;
    }
}
