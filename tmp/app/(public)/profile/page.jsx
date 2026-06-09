'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { Mail, Phone, MapPin, User as UserIcon, FileText, Image as ImageIcon, Lock, ChevronRight } from 'lucide-react'
import { usersAPI, authAPI, authStorage } from '@/lib/api'
import { setAuth } from '@/lib/features/auth/authSlice'

export default function ProfilePage() {
    const router = useRouter()
    const dispatch = useDispatch()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [showPasswordForm, setShowPasswordForm] = useState(false)
    const [changingPassword, setChangingPassword] = useState(false)
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        bio: '',
        address: '',
        image: '',
    })

    useEffect(() => {
        const token = authStorage.getToken()
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
    }, [router])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            const { email, ...payload } = form
            const updated = await usersAPI.updateProfile(payload)
            dispatch(setAuth({ token: authStorage.getToken(), user: updated }))
            toast.success('Đã cập nhật hồ sơ')
        } catch (err) {
            toast.error(err.message || 'Cập nhật thất bại')
        } finally {
            setSaving(false)
        }
    }

    const handlePasswordChange = (e) => {
        setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value })
    }

    const handleCancelPassword = () => {
        setShowPasswordForm(false)
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    }

    const handlePasswordSubmit = async (e) => {
        e?.preventDefault?.()
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp')
            return
        }
        setChangingPassword(true)
        try {
            await authAPI.changePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
            })
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
            setShowPasswordForm(false)
            toast.success('Đổi mật khẩu thành công')
        } catch (err) {
            toast.error(err.message || 'Đổi mật khẩu thất bại')
        } finally {
            setChangingPassword(false)
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

                <div className="pt-1 border-t border-slate-100">
                    {!showPasswordForm ? (
                        <button
                            type="button"
                            onClick={() => setShowPasswordForm(true)}
                            className="w-full flex items-center justify-between py-3 px-1 rounded-lg hover:bg-slate-50 transition text-left group"
                        >
                            <div className="flex items-center gap-2">
                                <Lock size={16} className="text-slate-500" />
                                <div>
                                    <p className="text-sm font-medium text-slate-700">Mật khẩu</p>
                                    <p className="text-xs text-slate-400 mt-0.5">••••••••</p>
                                </div>
                            </div>
                            <span className="text-sm text-indigo-500 group-hover:text-indigo-600 flex items-center gap-0.5">
                                Đổi mật khẩu
                                <ChevronRight size={16} />
                            </span>
                        </button>
                    ) : (
                        <div className="pt-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                    <Lock size={16} className="text-slate-500" />
                                    Đổi mật khẩu
                                </p>
                                <button
                                    type="button"
                                    onClick={handleCancelPassword}
                                    className="text-sm text-slate-500 hover:text-slate-700"
                                >
                                    Hủy
                                </button>
                            </div>
                            <PasswordField
                                label="Mật khẩu hiện tại"
                                name="currentPassword"
                                value={passwordForm.currentPassword}
                                onChange={handlePasswordChange}
                            />
                            <PasswordField
                                label="Mật khẩu mới"
                                name="newPassword"
                                value={passwordForm.newPassword}
                                onChange={handlePasswordChange}
                                placeholder="Ít nhất 6 ký tự"
                            />
                            <PasswordField
                                label="Xác nhận mật khẩu mới"
                                name="confirmPassword"
                                value={passwordForm.confirmPassword}
                                onChange={handlePasswordChange}
                            />
                            <button
                                type="button"
                                onClick={handlePasswordSubmit}
                                disabled={changingPassword}
                                className="w-full sm:w-auto px-6 py-2 bg-slate-800 hover:bg-slate-900 disabled:opacity-60 transition text-white rounded-full text-sm font-medium"
                            >
                                {changingPassword ? 'Đang đổi...' : 'Xác nhận đổi mật khẩu'}
                            </button>
                        </div>
                    )}
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

function PasswordField({ label, name, value, onChange, placeholder }) {
    return (
        <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">{label}</label>
            <input
                type="password"
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                autoComplete={name === 'currentPassword' ? 'current-password' : 'new-password'}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-300"
            />
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
