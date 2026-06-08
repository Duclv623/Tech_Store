'use client'
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { authAPI } from "@/lib/api";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [form, setForm] = useState({ newPassword: '', confirm: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.newPassword !== form.confirm) {
            toast.error('Mật khẩu nhập lại không khớp');
            return;
        }
        setLoading(true);
        try {
            const res = await authAPI.resetPassword({ token, newPassword: form.newPassword });
            toast.success(res.message || 'Đặt lại mật khẩu thành công');
            router.push('/login');
        } catch (err) {
            toast.error(err.message || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-3 text-center">
                <h1 className="text-2xl font-semibold text-slate-800">Link không hợp lệ</h1>
                <p className="text-sm text-slate-500">
                    Thiếu mã token. Vui lòng yêu cầu lại link đặt lại mật khẩu.
                </p>
                <Link href="/forgot-password" className="text-indigo-600 hover:underline text-sm">
                    Quên mật khẩu
                </Link>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-5"
        >
            <div>
                <h1 className="text-2xl font-semibold text-slate-800">Đặt lại mật khẩu</h1>
                <p className="text-sm text-slate-500 mt-1">Nhập mật khẩu mới của bạn.</p>
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Mật khẩu mới</label>
                <input
                    type="password"
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-300"
                    placeholder="••••••"
                />
            </div>

            <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Nhập lại mật khẩu</label>
                <input
                    type="password"
                    name="confirm"
                    value={form.confirm}
                    onChange={handleChange}
                    required
                    minLength={6}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-300"
                    placeholder="••••••"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 transition text-white rounded-full font-medium"
            >
                {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
            </button>

            <p className="text-sm text-center text-slate-600">
                <Link href="/login" className="text-indigo-600 hover:underline">
                    Quay lại đăng nhập
                </Link>
            </p>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <Suspense fallback={<p className="text-slate-500">Đang tải...</p>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    );
}
