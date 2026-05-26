package com.gocart.dto;

import com.gocart.model.Address;
import com.gocart.model.Order;
import com.gocart.model.OrderItem;
import com.gocart.model.OrderStatus;
import com.gocart.model.PaymentMethod;
import com.gocart.model.Product;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private String id;
    private Double total;
    private OrderStatus status;
    private String userId;
    private String storeId;
    private String addressId;
    private Boolean isPaid;
    private PaymentMethod paymentMethod;
    private LocalDateTime createdAt;
    private AddressSummary address;
    private List<Item> orderItems;

    public static OrderResponse from(Order o) {
        OrderResponse r = new OrderResponse();
        r.id = o.getId();
        r.total = o.getTotal();
        r.status = o.getStatus();
        r.userId = o.getUserId();
        r.storeId = o.getStoreId();
        r.addressId = o.getAddressId();
        r.isPaid = o.getIsPaid();
        r.paymentMethod = o.getPaymentMethod();
        r.createdAt = o.getCreatedAt();
        r.address = o.getAddress() == null ? null : AddressSummary.from(o.getAddress());
        r.orderItems = o.getOrderItems() == null ? List.of()
                : o.getOrderItems().stream().map(Item::from).toList();
        return r;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Item {
        private String productId;
        private Integer quantity;
        private Double price;
        private ProductSummary product;

        public static Item from(OrderItem it) {
            return new Item(
                    it.getProductId(),
                    it.getQuantity(),
                    it.getPrice(),
                    it.getProduct() == null ? null : ProductSummary.from(it.getProduct())
            );
        }
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ProductSummary {
        private String id;
        private String name;
        private List<String> images;
        private Double price;

        public static ProductSummary from(Product p) {
            return new ProductSummary(p.getId(), p.getName(), p.getImages(), p.getPrice());
        }
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AddressSummary {
        private String id;
        private String name;
        private String street;
        private String city;
        private String state;
        private String zip;
        private String country;
        private String phone;

        public static AddressSummary from(Address a) {
            return new AddressSummary(
                    a.getId(), a.getName(), a.getStreet(), a.getCity(),
                    a.getState(), a.getZip(), a.getCountry(), a.getPhone()
            );
        }
    }
}
