'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { Mail, Phone, MapPin, User as UserIcon, FileText, Image as ImageIcon } from 'lucide-react'
import { usersAPI } from '@/lib/api'
import { setAuth } from '@/lib/features/auth/authSlice'

export default function ProfilePage() {
    const router = useRouter()
    const dispatch = useDispatch()
    const token = useSelector(state => state.auth.token)

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        bio: '',
        address: '',
        image: '',
    })

    useEffect(() => {
        if (!token) {
            router.replace('/login')
            return
        }
        usersAPI.getProfile()
            .then(data => {
                setForm({
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    bio: data.bio || '',
                    address: data.address || '',
                    image: data.image || '',
                })
            })
            .catch(err => toast.error(err.message || 'Không tải được hồ sơ'))
            .finally(() => setLoading(false))
    }, [token, router])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            const { email, ...payload } = form
            const updated = await usersAPI.updateProfile(payload)
            dispatch(setAuth({ token, user: updated }))
            toast.success('Đã cập nhật hồ sơ')
        } catch (err) {
            toast.error(err.message || 'Cập nhật thất bại')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <p className="text-slate-500">Đang tải...</p>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-semibold text-slate-800">Hồ sơ của bạn</h1>
                <p className="text-sm text-slate-500 mt-1">Quản lý thông tin cá nhân</p>
            </div>

            <div className="flex items-center gap-5 mb-8 p-5 bg-white border border-slate-200 rounded-2xl">
                <div className="size-20 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center">
                    {form.image ? (
                        <img src={form.image} alt={form.name} className="size-full object-cover" />
                    ) : (
                        <UserIcon size={32} className="text-slate-400" />
                    )}
                </div>
                <div>
                    <h2 className="text-lg font-medium text-slate-800">{form.name || 'Chưa có tên'}</h2>
                    <p className="text-sm text-slate-500">{form.email}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
                <Field label="Họ tên" icon={UserIcon} name="name" value={form.name} onChange={handleChange} placeholder="Nguyễn Văn A" />

                <Field label="Email" icon={Mail} name="email" value={form.email} onChange={handleChange} disabled placeholder="email@example.com" />

                <Field label="Số điện thoại" icon={Phone} name="phone" value={form.phone} onChange={handleChange} placeholder="0901234567" />

                <Field label="Địa chỉ" icon={MapPin} name="address" value={form.address} onChange={handleChange} placeholder="123 Đường ABC, Quận 1, TP.HCM" />

                <Field label="Ảnh đại diện (URL)" icon={ImageIcon} name="image" value={form.image} onChange={handleChange} placeholder="https://..." />

                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <FileText size={16} className="text-slate-500" />
                        Giới thiệu
                    </label>
                    <textarea
                        name="bio"
                        rows={4}
                        value={form.bio}
                        onChange={handleChange}
                        placeholder="Vài dòng về bạn..."
                        className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                    />
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="w-full sm:w-auto px-8 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 transition text-white rounded-full font-medium"
                >
                    {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
            </form>
        </div>
    )
}

function Field({ label, icon: Icon, name, value, onChange, disabled, placeholder }) {
    return (
        <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Icon size={16} className="text-slate-500" />
                {label}
            </label>
            <input
                type="text"
                name={name}
                value={value}
                onChange={onChange}
                disabled={disabled}
                placeholder={placeholder}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-300 disabled:bg-slate-100 disabled:text-slate-500"
            />
        </div>
    )
}
