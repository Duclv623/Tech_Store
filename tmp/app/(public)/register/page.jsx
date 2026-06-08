'use client'
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { authAPI } from "@/lib/api";
import { setAuth } from "@/lib/features/auth/authSlice";

export default function RegisterPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await authAPI.register(form);
            toast.success('Đăng ký thành công! Vui lòng kiểm tra hộp thư email để xác minh tài khoản.', {
                duration: 6000
            });
            router.push('/login');
        } catch (err) {
            toast.error(err.message || 'Đăng ký thất bại');
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
                    <h1 className="text-2xl font-semibold text-slate-800">Đăng ký</h1>
                    <p className="text-sm text-slate-500 mt-1">Tạo tài khoản GoCart mới</p>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Họ tên</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-300"
                        placeholder="Nguyễn Văn A"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-300"
                        placeholder="you@example.com"
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700">Mật khẩu</label>
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-300"
                        placeholder="Tối thiểu 6 ký tự"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 transition text-white rounded-full font-medium"
                >
                    {loading ? 'Đang tạo...' : 'Đăng ký'}
                </button>

                <p className="text-sm text-center text-slate-600">
                    Đã có tài khoản?{' '}
                    <Link href="/login" className="text-indigo-600 hover:underline">
                        Đăng nhập
                    </Link>
                </p>
            </form>
        </div>
    );
}
