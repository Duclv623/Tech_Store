'use client'
import { Suspense, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { authAPI } from "@/lib/api";

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState("loading"); // loading, success, error
    const [message, setMessage] = useState("Đang tiến hành xác thực tài khoản...");
    const effectCalled = useRef(false);

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Đường dẫn xác nhận không hợp lệ hoặc thiếu mã token.");
            return;
        }

        // Dùng useRef để tránh chạy useEffect 2 lần ở React Strict Mode
        if (effectCalled.current) return;
        effectCalled.current = true;

        const verify = async () => {
            try {
                const res = await authAPI.verifyEmail(token);
                setStatus("success");
                setMessage(res.message || "Tài khoản của bạn đã được kích hoạt thành công!");
            } catch (err) {
                setStatus("error");
                setMessage(err.message || "Xác thực email thất bại hoặc liên kết đã hết hạn.");
            }
        };

        verify();
    }, [token]);

    return (
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Xác minh tài khoản</h1>
                <p className="text-sm text-slate-500 mt-1">Hệ thống kích hoạt tài khoản GoCart</p>
            </div>

            <div className="flex flex-col items-center justify-center py-4">
                {status === "loading" && (
                    <div className="flex flex-col items-center space-y-3">
                        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                        <p className="text-sm font-medium text-slate-600 animate-pulse">{message}</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="flex flex-col items-center space-y-3">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center shadow-inner">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-emerald-600">Thành công</h3>
                        <p className="text-sm text-slate-600">{message}</p>
                    </div>
                )}

                {status === "error" && (
                    <div className="flex flex-col items-center space-y-3">
                        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center shadow-inner">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-rose-600">Thất bại</h3>
                        <p className="text-sm text-slate-600 px-4">{message}</p>
                    </div>
                )}
            </div>

            <div className="pt-2">
                {status === "success" ? (
                    <Link
                        href="/login"
                        className="inline-block w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium transition duration-200 shadow-sm"
                    >
                        Đăng nhập ngay
                    </Link>
                ) : (
                    <Link
                        href="/login"
                        className="inline-block w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full font-medium transition duration-200"
                    >
                        Quay lại đăng nhập
                    </Link>
                )}
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 bg-slate-50/50">
            <Suspense fallback={
                <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-sm text-center py-12">
                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-500 text-sm">Đang chuẩn bị xác thực...</p>
                </div>
            }>
                <VerifyEmailContent />
            </Suspense>
        </div>
    );
}
