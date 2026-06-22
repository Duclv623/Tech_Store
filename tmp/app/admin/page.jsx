'use client'
import { dummyAdminDashboardData } from "@/assets/assets"
import Loading from "@/components/Loading"
import OrdersAreaChart from "@/components/OrdersAreaChart"
import { CircleDollarSignIcon, ShoppingBasketIcon, StoreIcon, TagsIcon, TrendingUpIcon } from "lucide-react"
import { useEffect, useState } from "react"

// Định dạng Date -> YYYY-MM-DD theo giờ local (tránh lệch ngày do UTC)
const fmt = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

// Các mốc lọc nhanh
const PRESETS = {
    '7d': () => { const to = new Date(); const from = new Date(); from.setDate(from.getDate() - 6); return { from: fmt(from), to: fmt(to) } },
    '30d': () => { const to = new Date(); const from = new Date(); from.setDate(from.getDate() - 29); return { from: fmt(from), to: fmt(to) } },
    'month': () => { const to = new Date(); const from = new Date(to.getFullYear(), to.getMonth(), 1); return { from: fmt(from), to: fmt(to) } },
    'all': () => ({ from: '', to: '' }),
}

const PRESET_LABELS = [['7d', '7 ngày'], ['30d', '30 ngày'], ['month', 'Tháng này'], ['all', 'Tất cả']]

export default function AdminDashboard() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    const [loading, setLoading] = useState(true)
    const [activePreset, setActivePreset] = useState('all')
    const [from, setFrom] = useState('')
    const [to, setTo] = useState('')
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

    const fetchDashboardData = async (fromArg = '', toArg = '') => {
        try {
            const { adminAPI } = await import('@/lib/api');
            const data = await adminAPI.getDashboard(fromArg, toArg);
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

    // Chọn mốc nhanh
    const applyPreset = (key) => {
        const { from: f, to: t } = PRESETS[key]()
        setActivePreset(key)
        setFrom(f)
        setTo(t)
        fetchDashboardData(f, t)
    }

    // Áp dụng khoảng ngày tùy chọn
    const applyCustom = () => {
        setActivePreset('custom')
        fetchDashboardData(from, to)
    }

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

            {/* Bộ lọc thời gian */}
            <div className="flex flex-wrap items-center gap-2 mt-5">
                {PRESET_LABELS.map(([key, label]) => (
                    <button
                        key={key}
                        onClick={() => applyPreset(key)}
                        className={`px-3 py-1.5 rounded-lg text-sm border transition ${activePreset === key
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                    >
                        {label}
                    </button>
                ))}
                <div className="flex items-center gap-2 sm:ml-auto">
                    <input
                        type="date"
                        value={from}
                        onChange={e => setFrom(e.target.value)}
                        className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-600 outline-none focus:border-indigo-400"
                    />
                    <span className="text-slate-400">→</span>
                    <input
                        type="date"
                        value={to}
                        onChange={e => setTo(e.target.value)}
                        className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-600 outline-none focus:border-indigo-400"
                    />
                    <button
                        onClick={applyCustom}
                        className="px-4 py-1.5 rounded-lg text-sm bg-slate-800 text-white hover:bg-slate-900 active:scale-95 transition"
                    >
                        Áp dụng
                    </button>
                </div>
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
