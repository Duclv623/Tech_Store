'use client'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Heart } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { fetchWishlist, selectWishlistItems } from '@/lib/features/wishlist/wishlistSlice'
import WishlistButton from '@/components/WishlistButton'
import toast from 'react-hot-toast'

export default function AccountWishlistPage() {
    const dispatch = useDispatch()
    const items = useSelector(selectWishlistItems)
    const loading = useSelector(state => state.wishlist.loading)
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    useEffect(() => {
        dispatch(fetchWishlist()).catch(() => toast.error('Không tải được danh sách yêu thích'))
    }, [dispatch])

    if (loading) {
        return (
            <div className="min-h-[40vh] flex items-center justify-center">
                <p className="text-slate-500">Đang tải...</p>
            </div>
        )
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-800">Sản phẩm yêu thích</h2>
                <span className="text-sm text-slate-500">{items.length} sản phẩm</span>
            </div>

            {items.length === 0 ? (
                <div className="min-h-[40vh] flex flex-col items-center justify-center gap-4 text-slate-400 bg-white border border-slate-200 rounded-2xl">
                    <Heart size={56} strokeWidth={1.2} />
                    <p className="text-lg font-medium">Chưa có sản phẩm yêu thích</p>
                    <Link
                        href="/shop"
                        className="mt-1 px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm rounded-full transition"
                    >
                        Khám phá cửa hàng
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
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
            )}
        </div>
    )
}
