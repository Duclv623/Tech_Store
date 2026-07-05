'use client'

import { addToCart } from "@/lib/features/cart/cartSlice";
import { StarIcon, TagIcon, EarthIcon, CreditCardIcon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Counter from "./Counter";
import { useDispatch, useSelector } from "react-redux";

const ProductDetails = ({ product }) => {

    const productId = product.id;
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';

    const cart = useSelector(state => state.cart.cartItems);
    const dispatch = useDispatch();

    const router = useRouter()

    // Handle case where images might be undefined or empty
    const defaultImage = product.images && product.images.length > 0 ? product.images[0] : '/placeholder.png';
    const [mainImage, setMainImage] = useState(defaultImage);

    const stockQuantity = product.stockQuantity ?? 0
    const outOfStock = product.inStock === false || stockQuantity <= 0

    const addToCartHandler = () => {
        if (outOfStock) return
        dispatch(addToCart({ productId }))
    }

    // Handle case where rating might be undefined or empty
    const averageRating = product.rating && product.rating.length > 0
        ? product.rating.reduce((acc, item) => acc + item.rating, 0) / product.rating.length
        : 0;
    
    return (
            <div className="flex max-lg:flex-col gap-12">
            <div className="flex max-sm:flex-col-reverse gap-3">
                <div className="flex sm:flex-col gap-3">
                    {product.images && product.images.length > 0 ? product.images.map((image, index) => (
                        <div key={index} onClick={() => setMainImage(product.images[index])} className="bg-slate-100 flex items-center justify-center size-26 rounded-lg group cursor-pointer">
                            <Image src={image} className="group-hover:scale-103 group-active:scale-95 transition" alt="" width={45} height={45} />
                        </div>
                    )) : (
                        <div className="bg-slate-100 flex items-center justify-center size-26 rounded-lg">
                            <Image src={defaultImage} alt="" width={45} height={45} />
                        </div>
                    )}
                </div>
                <div className="flex justify-center items-center h-100 sm:size-113 bg-slate-100 rounded-lg ">
                    <Image src={mainImage} alt="" width={250} height={250} />
                </div>
            </div>
            <div className="flex-1">
                <h1 className="text-3xl font-semibold text-slate-800">{product.name}</h1>
                <div className='flex items-center mt-2'>
                    {Array(5).fill('').map((_, index) => (
                        <StarIcon key={index} size={14} className='text-transparent mt-0.5' fill={averageRating >= index + 1 ? "#00C950" : "#D1D5DB"} />
                    ))}
                    <p className="text-sm ml-3 text-slate-500">{product.rating && product.rating.length > 0 ? product.rating.length : 0} Đánh giá</p>
                </div>
                <div className="flex items-start my-6 gap-3 text-2xl font-semibold text-slate-800">
                    <p> {currency}{product.price} </p>
                    <p className="text-xl text-slate-500 line-through">{currency}{product.mrp}</p>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                    <TagIcon size={14} />
                    <p>Tiết kiệm {((product.mrp - product.price) / product.mrp * 100).toFixed(0)}% ngay bây giờ</p>
                </div>
                <div className="mt-4">
                    {outOfStock ? (
                        <span className="inline-block px-3 py-1 text-sm font-medium rounded bg-red-50 text-red-600">Hết hàng</span>
                    ) : stockQuantity <= 5 ? (
                        <span className="inline-block px-3 py-1 text-sm font-medium rounded bg-amber-50 text-amber-600">Chỉ còn {stockQuantity} sản phẩm</span>
                    ) : (
                        <span className="inline-block px-3 py-1 text-sm font-medium rounded bg-green-50 text-green-600">Còn hàng</span>
                    )}
                </div>
                <div className="flex items-end gap-5 mt-6">
                    {
                        cart[productId] && !outOfStock && (
                            <div className="flex flex-col gap-3">
                                <p className="text-lg text-slate-800 font-semibold">Số lượng</p>
                                <Counter productId={productId} max={stockQuantity} />
                            </div>
                        )
                    }
                    <button
                        onClick={() => !cart[productId] ? addToCartHandler() : router.push('/cart')}
                        disabled={outOfStock && !cart[productId]}
                        className="bg-slate-800 text-white px-10 py-3 text-sm font-medium rounded hover:bg-slate-900 active:scale-95 transition disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-800"
                    >
                        {outOfStock ? 'Hết hàng' : !cart[productId] ? 'Thêm vào giỏ' : 'Xem giỏ hàng'}
                    </button>
                </div>
                <hr className="border-gray-300 my-5" />
                <div className="flex flex-col gap-4 text-slate-500">
                    <p className="flex gap-3"> <EarthIcon className="text-slate-400" /> Miễn phí vận chuyển toàn cầu </p>
                    <p className="flex gap-3"> <CreditCardIcon className="text-slate-400" /> Thanh toán an toàn 100% </p>
                    <p className="flex gap-3"> <UserIcon className="text-slate-400" /> Được các thương hiệu hàng đầu tin dùng </p>
                </div>

            </div>
        </div>
    )
}

export default ProductDetails