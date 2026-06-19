'use client'
import { dummyAdminDashboardData } from "@/assets/assets"
import Loading from "@/components/Loading"
import OrdersAreaChart from "@/components/OrdersAreaChart"
import { CircleDollarSignIcon, ShoppingBasketIcon, StoreIcon, TagsIcon, TrendingUpIcon } from "lucide-react"
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
        { title: 'Tổng doanh thu', value: `${currency}${(dashboardData.revenue || 0).toLocaleString()}`, icon: CircleDollarSignIcon, iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
        { title: 'Tổng đơn hàng', value: dashboardData.orders, icon: TagsIcon, iconBg: 'bg-indigo-50', iconColor: 'text-indigo-600' },
        { title: 'Tổng sản phẩm', value: dashboardData.products, icon: ShoppingBasketIcon, iconBg: 'bg-sky-50', iconColor: 'text-sky-600' },
        { title: 'Tổng cửa hàng', value: dashboardData.stores, icon: StoreIcon, iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
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

    const maxSold = Math.max(...dashboardData.topProducts.map(p => p.totalSold || 0), 1)

    // Màu huy hiệu cho 3 hạng đầu
    const rankClass = (i) => {
        if (i === 0) return 'bg-amber-100 text-amber-700'
        if (i === 1) return 'bg-slate-200 text-slate-600'
        if (i === 2) return 'bg-orange-100 text-orange-700'
        return 'bg-slate-100 text-slate-400'
    }

    return (
        <div className="text-slate-500 max-w-6xl">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-slate-800">Bảng điều khiển</h1>
                <p className="text-sm text-slate-400 mt-1">Tổng quan hoạt động cửa hàng</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-6">
                {dashboardCardsData.map((card, index) => (
                    <div key={index} className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                        <div className={`size-12 rounded-xl flex items-center justify-center ${card.iconBg}`}>
                            <card.icon size={22} className={card.iconColor} />
                        </div>
                        <p className="text-sm text-slate-400 mt-4">{card.title}</p>
                        <p className="text-2xl font-semibold text-slate-800 mt-1">{card.value}</p>
                    </div>
                ))}
            </div>

            {/* Chart + Top products */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 mt-6">
                {/* Area Chart */}
                <div className="xl:col-span-3 bg-white border border-slate-200 rounded-2xl p-5">
                    <OrdersAreaChart allOrders={dashboardData.allOrders} />
                </div>

                {/* Top sản phẩm bán chạy */}
                <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-5">
                        <TrendingUpIcon size={18} className="text-indigo-500" />
                        <h2 className="text-base font-semibold text-slate-800">Sản phẩm bán chạy</h2>
                    </div>

                    {dashboardData.topProducts.length === 0 ? (
                        <div className="flex items-center justify-center h-40 text-sm text-slate-400">
                            Chưa có dữ liệu bán hàng
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {dashboardData.topProducts.map((p, index) => (
                                <div key={p.productId} className="flex items-center gap-3">
                                    <span className={`size-7 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${rankClass(index)}`}>
                                        {index + 1}
                                    </span>
                                    <div className="size-11 shrink-0 rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center">
                                        {p.image && <img src={p.image} alt={p.name} className="size-full object-contain" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-800 truncate">{p.name}</p>
                                        <div className="mt-1.5 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full"
                                                style={{ width: `${((p.totalSold || 0) / maxSold) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-sm font-semibold text-slate-800">{p.totalSold}</p>
                                        <p className="text-xs text-slate-400">{currency}{(p.revenue || 0).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
