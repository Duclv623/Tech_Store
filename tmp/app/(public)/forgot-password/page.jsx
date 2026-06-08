'use client'
import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { authAPI } from "@/lib/api";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await authAPI.forgotPassword({ email });
            toast.success(res.message || 'Đã gửi email đặt lại mật khẩu');
            setSent(true);
        } catch (err) {
            toast.error(err.message || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-5"
            >
                <div>
                    <h1 className="text-2xl font-semibold text-slate-800">Quên mật khẩu</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Nhập email, chúng tôi sẽ gửi link đặt lại mật khẩu.
                    </p>
                </div>

                {sent ? (
                    <p className="text-sm text-slate-600">
                        Nếu email tồn tại, một link đặt lại mật khẩu đã được gửi tới hộp thư của bạn
                        (kiểm tra cả mục Spam). Link hết hạn sau 30 phút.
                    </p>
                ) : (
                    <>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-300"
                                placeholder="you@example.com"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 transition text-white rounded-full font-medium"
                        >
                            {loading ? 'Đang gửi...' : 'Gửi link đặt lại'}
                        </button>
                    </>
                )}

                <p className="text-sm text-center text-slate-600">
                    <Link href="/login" className="text-indigo-600 hover:underline">
                        Quay lại đăng nhập
                    </Link>
                </p>
            </form>
        </div>
    );
}
