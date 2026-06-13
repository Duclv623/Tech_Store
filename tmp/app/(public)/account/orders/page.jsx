'use client'
import { useEffect, useState } from "react";
import OrderItem from "@/components/OrderItem";
import { useDispatch } from "react-redux";
import { ordersAPI, ratingsAPI, authStorage } from "@/lib/api";
import { setRatings } from "@/lib/features/rating/ratingSlice";
import toast from "react-hot-toast";

export default function AccountOrders() {
    const dispatch = useDispatch();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        ordersAPI.getMine()
            .then(data => setOrders(Array.isArray(data) ? data : []))
            .catch(err => toast.error(err.message || 'Không tải được đơn hàng'))
            .finally(() => setLoading(false));

        const user = authStorage.getUser();
        if (user?.id) {
            ratingsAPI.getByUser(user.id)
                .then(data => dispatch(setRatings(Array.isArray(data) ? data : [])))
                .catch(() => { /* không chặn hiển thị đơn hàng nếu lỗi tải đánh giá */ });
        }
    }, [dispatch]);

    if (loading) {
        return (
            <div className="min-h-[40vh] flex items-center justify-center">
                <p className="text-slate-500">Đang tải đơn hàng...</p>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-[40vh] flex items-center justify-center text-slate-400">
                <h2 className="text-xl sm:text-2xl font-semibold">Bạn chưa có đơn hàng nào</h2>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-lg font-medium text-slate-800">Đơn hàng của tôi</h2>
                <p className="text-sm text-slate-500">Hiển thị tổng cộng {orders.length} đơn hàng</p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-slate-500 table-auto border-separate border-spacing-y-12 border-spacing-x-4">
                    <thead>
                        <tr className="max-sm:text-sm text-slate-600 max-md:hidden">
                            <th className="text-left">Sản phẩm</th>
                            <th className="text-center">Tổng tiền</th>
                            <th className="text-left">Địa chỉ</th>
                            <th className="text-left">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <OrderItem order={order} key={order.id} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
