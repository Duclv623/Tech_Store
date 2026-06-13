'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { User as UserIcon, Lock, Package } from 'lucide-react'
import { authStorage } from '@/lib/api'

const NAV = [
    { href: '/account/profile', label: 'Thông tin cá nhân', icon: UserIcon },
    { href: '/account/password', label: 'Đổi mật khẩu', icon: Lock },
    { href: '/account/orders', label: 'Đơn hàng', icon: Package },
]

export default function AccountLayout({ children }) {
    const pathname = usePathname()
    const router = useRouter()
    const [ready, setReady] = useState(false)

    useEffect(() => {
        if (!authStorage.getToken()) {
            router.replace('/login')
            return
        }
        setReady(true)
    }, [router])

    if (!ready) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <p className="text-slate-500">Đang tải...</p>
            </div>
        )
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-semibold text-slate-800 mb-8">Tài khoản của bạn</h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <aside className="md:w-60 shrink-0">
                    <nav className="flex md:flex-col gap-1 md:sticky md:top-24">
                        {NAV.map(({ href, label, icon: Icon }) => {
                            const active = pathname === href || pathname.startsWith(href + '/')
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${active
                                        ? 'bg-indigo-50 text-indigo-600'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                                        }`}
                                >
                                    <Icon size={18} />
                                    <span className="whitespace-nowrap">{label}</span>
                                </Link>
                            )
                        })}
                    </nav>
                </aside>

                {/* Nội dung bên phải */}
                <section className="flex-1 min-w-0">{children}</section>
            </div>
        </div>
    )
}
