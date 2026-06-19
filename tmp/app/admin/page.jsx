'use client'
import { dummyAdminDashboardData } from "@/assets/assets"
import Loading from "@/components/Loading"
import OrdersAreaChart from "@/components/OrdersAreaChart"
import { CircleDollarSignIcon, ShoppingBasketIcon, StoreIcon, TagsIcon } from "lucide-react"
import { useEffect, useState } from "react"

export default function AdminDashboard() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    const [loading, setLoading] = useState(true)
    const [dashboardData, setDashboardData] = useState({
        products: 0,
        revenue: 0,
        orders: 0,
        stores: 0,
        allOrders: [],
        topProducts: [],
    })

    const dashboardCardsData = [
        { title: 'Tổng sản phẩm', value: dashboardData.products, icon: ShoppingBasketIcon },
        { title: 'Tổng doanh thu', value: currency + dashboardData.revenue, icon: CircleDollarSignIcon },
        { title: 'Tổng đơn hàng', value: dashboardData.orders, icon: TagsIcon },
        { title: 'Tổng cửa hàng', value: dashboardData.stores, icon: StoreIcon },
    ]

    const fetchDashboardData = async () => {
        try {
            const { adminAPI } = await import('@/lib/api');
            const data = await adminAPI.getDashboard();
            setDashboardData({
                products: data.products || 0,
                revenue: data.revenue || 0,
                orders: data.orders || 0,
                stores: data.stores || 0,
                allOrders: data.allOrders || [],
                topProducts: data.topProducts || [],
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            // Fallback to dummy data on error
            setDashboardData(dummyAdminDashboardData);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    if (loading) return <Loading />

    return (
        <div className="text-slate-500">
            <h1 className="text-2xl">Bảng điều khiển <span className="text-slate-800 font-medium">Quản trị viên</span></h1>

            {/* Cards */}
            <div className="flex flex-wrap gap-5 my-10 mt-4">
                {
                    dashboardCardsData.map((card, index) => (
                        <div key={index} className="flex items-center gap-10 border border-slate-200 p-3 px-6 rounded-lg">
                            <div className="flex flex-col gap-3 text-xs">
                                <p>{card.title}</p>
                                <b className="text-2xl font-medium text-slate-700">{card.value}</b>
                            </div>
                            <card.icon size={50} className=" w-11 h-11 p-2.5 text-slate-400 bg-slate-100 rounded-full" />
                        </div>
                    ))
                }
            </div>

            {/* Area Chart */}
            <OrdersAreaChart allOrders={dashboardData.allOrders} />

            {/* Top sản phẩm bán chạy */}
            <div className="mt-10">
                <h2 className="text-lg text-slate-800 font-medium mb-4">Sản phẩm bán chạy</h2>
                <div className="overflow-x-auto rounded-lg border border-slate-200 max-w-3xl">
                    <table className="min-w-full bg-white text-sm">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="py-3 px-4 text-left font-semibold text-slate-600">#</th>
                                <th className="py-3 px-4 text-left font-semibold text-slate-600">Sản phẩm</th>
                                <th className="py-3 px-4 text-right font-semibold text-slate-600">Đã bán</th>
                                <th className="py-3 px-4 text-right font-semibold text-slate-600">Doanh thu</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {dashboardData.topProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-6 px-4 text-center text-slate-400">Chưa có dữ liệu bán hàng</td>
                                </tr>
                            ) : (
                                dashboardData.topProducts.map((p, index) => (
                                    <tr key={p.productId} className="hover:bg-slate-50">
                                        <td className="py-3 px-4 text-slate-500">{index + 1}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded bg-slate-100 overflow-hidden flex items-center justify-center shrink-0">
                                                    {p.image && <img src={p.image} alt={p.name} className="size-full object-contain" />}
                                                </div>
                                                <span className="text-slate-800 font-medium truncate max-w-xs">{p.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-right text-slate-700 font-medium">{p.totalSold}</td>
                                        <td className="py-3 px-4 text-right text-slate-700">{currency}{(p.revenue || 0).toLocaleString()}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}