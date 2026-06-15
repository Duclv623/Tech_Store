'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Trang yêu thích đã chuyển vào mục Tài khoản → /account/wishlist
export default function WishlistRedirect() {
    const router = useRouter()
    useEffect(() => {
        router.replace('/account/wishlist')
    }, [router])
    return (
        <div className="min-h-[70vh] flex items-center justify-center">
            <p className="text-slate-500">Đang chuyển hướng...</p>
        </div>
    )
}
