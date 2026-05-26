'use client'
import PageTitle from "@/components/PageTitle"
import { useEffect, useState } from "react";
import OrderItem from "@/components/OrderItem";
import { useRouter } from "next/navigation";
import { ordersAPI, authStorage } from "@/lib/api";
import toast from "react-hot-toast";

export default function Orders() {

    const router = useRouter();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = authStorage.getToken();
        if (!token) {
            router.replace('/login');
            return;
        }
        ordersAPI.getMine()
            .then(data => setOrders(Array.isArray(data) ? data : []))
            .catch(err => toast.error(err.message || 'Không tải được đơn hàng'))
            .finally(() => setLoading(false));
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <p className="text-slate-500">Đang tải đơn hàng...</p>
            </div>
        );
    }

    return (
        <div className="min-h-[70vh] mx-6">
            {orders.length > 0 ? (
                <div className="my-20 max-w-7xl mx-auto">
                    <PageTitle heading="Đơn hàng của tôi" text={`Hiển thị tổng cộng ${orders.length} đơn hàng`} linkText={'Về trang chủ'} />

                    <table className="w-full max-w-5xl text-slate-500 table-auto border-separate border-spacing-y-12 border-spacing-x-4">
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
            ) : (
                <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
                    <h1 className="text-2xl sm:text-4xl font-semibold">Bạn chưa có đơn hàng nào</h1>
                </div>
            )}
        </div>
    )
}
