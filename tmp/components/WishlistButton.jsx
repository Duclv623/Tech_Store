'use client'
import { Heart } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { toggleWishlist, selectIsWishlisted } from '@/lib/features/wishlist/wishlistSlice'
import toast from 'react-hot-toast'

const WishlistButton = ({ productId, className = '' }) => {
    const dispatch = useDispatch()
    const router = useRouter()
    const user = useSelector(state => state.auth.user)
    const isWishlisted = useSelector(selectIsWishlisted(productId))

    const handleClick = async (e) => {
        e.preventDefault()
        e.stopPropagation() // ngăn click lan ra Link cha

        if (!user) {
            toast.error('Vui lòng đăng nhập để lưu yêu thích')
            router.push('/login')
            return
        }

        try {
            const result = await dispatch(toggleWishlist(productId)).unwrap()
            toast.success(result.added ? '❤️ Đã thêm vào yêu thích' : 'Đã bỏ yêu thích')
        } catch {
            toast.error('Có lỗi xảy ra, thử lại sau')
        }
    }

    return (
        <button
            onClick={handleClick}
            title={isWishlisted ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
            className={`p-1.5 rounded-full transition-all duration-200 hover:scale-110 ${isWishlisted
                    ? 'text-red-500 bg-red-50'
                    : 'text-slate-400 hover:text-red-400 bg-white/80 hover:bg-red-50'
                } ${className}`}
        >
            <Heart
                size={18}
                fill={isWishlisted ? '#ef4444' : 'none'}
                className="transition-all duration-200"
            />
        </button>
    )
}

export default WishlistButton
