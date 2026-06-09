"use client";

import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
// WebSocket endpoint là /ws (không có /api prefix)
// Ví dụ: NEXT_PUBLIC_API_URL = "http://localhost:8080/api" → WS_URL = "http://localhost:8080"
const WS_BASE_URL = API_URL.replace(/\/api\/?$/, "");


/**
 * Hook subscribe real-time trạng thái đơn hàng qua WebSocket (STOMP).
 *
 * @param {string} orderId - ID của đơn hàng cần theo dõi
 * @param {(message: { orderId, status, message }) => void} onStatusChange - callback khi có cập nhật
 */
export function useOrderSocket(orderId, onStatusChange) {
    const clientRef = useRef(null);

    useEffect(() => {
        if (!orderId) return;

        const client = new Client({
            webSocketFactory: () => new SockJS(`${WS_BASE_URL}/ws`),
            reconnectDelay: 5000,
            onConnect: () => {
                client.subscribe(`/topic/orders/${orderId}`, (frame) => {
                    try {
                        const data = JSON.parse(frame.body);
                        onStatusChange(data);
                    } catch (e) {
                        console.error("WebSocket parse error:", e);
                    }
                });
            },
            onStompError: (frame) => {
                console.error("STOMP error:", frame.headers["message"]);
            },
        });

        client.activate();
        clientRef.current = client;

        return () => {
            client.deactivate();
        };
    }, [orderId]); // eslint-disable-line react-hooks/exhaustive-deps
}
