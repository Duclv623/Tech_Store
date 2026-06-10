'use client'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { fetchWishlist, selectWishlistItems } from '@/lib/features/wishlist/wishlistSlice'
import { authStorage } from '@/lib/api'
import WishlistButton from '@/components/WishlistButton'
import PageTitle from '@/components/PageTitle'
import toast from 'react-hot-toast'

export default function WishlistPage() {
    const dispatch = useDispatch()
    const router = useRouter()
    const items = useSelector(selectWishlistItems)
    const loading = useSelector(state => state.wishlist.loading)
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    useEffect(() => {
        const token = authStorage.getToken()
        if (!token) {
            router.replace('/login')
            return
        }
        dispatch(fetchWishlist()).catch(() => toast.error('Không tải được danh sách yêu thích'))
    }, [dispatch, router])

    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <p className="text-slate-500">Đang tải...</p>
            </div>
        )
    }

    if (items.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-slate-400">
                <Heart size={64} strokeWidth={1.2} />
                <h1 className="text-2xl sm:text-4xl font-semibold">Chưa có sản phẩm yêu thích</h1>
                <Link
                    href="/shop"
                    className="mt-2 px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm rounded-full transition"
                >
                    Khám phá cửa hàng
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-[70vh] mx-6 my-20">
            <div className="max-w-7xl mx-auto">
                <PageTitle
                    heading="Sản phẩm yêu thích"
                    text={`${items.length} sản phẩm`}
                    linkText="Về trang chủ"
                />

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-10">
                    {items.map((item) => {
                        const product = item.product || { id: item.productId, images: [], name: 'Đang tải...', price: '—' }
                        return (
                            <div key={item.id || item.productId} className="group relative">
                                <Link href={`/product/${product.id}`}>
                                    <div className="relative bg-[#F5F5F5] h-40 sm:h-52 rounded-lg flex items-center justify-center">
                                        <Image
                                            width={300}
                                            height={300}
                                            className="max-h-32 sm:max-h-44 w-auto group-hover:scale-110 transition duration-300"
                                            src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder.png'}
                                            alt={product.name}
                                        />
                                        {/* Nút bỏ yêu thích – luôn hiện */}
                                        <div className="absolute top-2 right-2">
                                            <WishlistButton productId={product.id} />
                                        </div>
                                    </div>
                                    <div className="pt-2 text-sm text-slate-700">
                                        <p className="font-medium truncate">{product.name}</p>
                                        <p className="text-indigo-600 font-semibold">{currency}{product.price}</p>
                                    </div>
                                </Link>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
