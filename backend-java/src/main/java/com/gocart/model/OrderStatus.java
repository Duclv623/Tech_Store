package com.gocart.model;

public enum OrderStatus {
    ORDER_PLACED("Đã đặt", "Đặt hàng thành công",
            "Đơn hàng của bạn đã được đặt và đang chờ người bán xác nhận."),
    PROCESSING("Đang xử lý", "Đơn hàng đang được chuẩn bị",
            "Người bán đang chuẩn bị đơn hàng của bạn."),
    SHIPPED("Đang giao", "Đơn hàng đang được giao",
            "Đơn hàng của bạn đang trên đường giao đến bạn."),
    DELIVERED("Đã giao", "Giao hàng thành công",
            "Đơn hàng đã được giao thành công. Cảm ơn bạn đã mua sắm!"),
    CANCELLED("Đã hủy", "Đơn hàng đã bị hủy",
            "Đơn hàng của bạn đã bị hủy.");

    private final String label;        // nhãn ngắn: "Đã giao", "Đã hủy"...
    private final String notiTitle;    // tiêu đề thông báo
    private final String notiMessage;  // nội dung thông báo

    OrderStatus(String label, String notiTitle, String notiMessage) {
        this.label = label;
        this.notiTitle = notiTitle;
        this.notiMessage = notiMessage;
    }

    public String getLabel() {
        return label;
    }

    public String getNotiTitle() {
        return notiTitle;
    }

    public String getNotiMessage() {
        return notiMessage;
    }
}
