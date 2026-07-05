'use client'
import { addToCart, removeFromCart } from "@/lib/features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const Counter = ({ productId, max }) => {

    const { cartItems } = useSelector(state => state.cart);

    const dispatch = useDispatch();

    const quantity = cartItems[productId] || 0
    // max = số lượng còn trong kho; nếu không truyền thì không giới hạn ở client (backend vẫn chặn)
    const atMax = typeof max === 'number' && quantity >= max

    const addToCartHandler = () => {
        if (atMax) {
            toast.error(`Chỉ còn ${max} sản phẩm trong kho`)
            return
        }
        dispatch(addToCart({ productId }))
    }

    const removeFromCartHandler = () => {
        dispatch(removeFromCart({ productId }))
    }

    return (
        <div className="inline-flex items-center gap-1 sm:gap-3 px-3 py-1 rounded border border-slate-200 max-sm:text-sm text-slate-600">
            <button onClick={removeFromCartHandler} className="p-1 select-none">-</button>
            <p className="p-1">{quantity}</p>
            <button onClick={addToCartHandler} disabled={atMax} className="p-1 select-none disabled:opacity-40 disabled:cursor-not-allowed">+</button>
        </div>
    )
}

export default Counter