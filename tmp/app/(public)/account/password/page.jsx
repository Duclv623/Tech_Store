'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Lock } from 'lucide-react'
import { authAPI } from '@/lib/api'

export default function ChangePasswordPage() {
    const [changingPassword, setChangingPassword] = useState(false)
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })

    const handlePasswordChange = (e) => {
        setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value })
    }

    const handlePasswordSubmit = async (e) => {
        e.preventDefault()
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
            toast.success('Đổi mật khẩu thành công')
        } catch (err) {
            toast.error(err.message || 'Đổi mật khẩu thất bại')
        } finally {
            setChangingPassword(false)
        }
    }

    return (
        <form onSubmit={handlePasswordSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 max-w-lg">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Lock size={18} className="text-slate-500" />
                <h2 className="text-lg font-medium text-slate-800">Đổi mật khẩu</h2>
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
                type="submit"
                disabled={changingPassword}
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-800 hover:bg-slate-900 disabled:opacity-60 transition text-white rounded-full text-sm font-medium"
            >
                {changingPassword ? 'Đang đổi...' : 'Xác nhận đổi mật khẩu'}
            </button>
        </form>
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
