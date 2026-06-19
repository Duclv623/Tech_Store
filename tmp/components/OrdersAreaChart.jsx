'use client'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function OrdersAreaChart({ allOrders = [] }) {

    // Group orders by date
    const ordersPerDay = allOrders.reduce((acc, order) => {
        if (!order || !order.createdAt) {
            return acc; // Skip invalid orders
        }
        
        try {
            const dateObj = new Date(order.createdAt);
            // Check if date is valid
            if (isNaN(dateObj.getTime())) {
                return acc; // Skip invalid dates
            }
            const date = dateObj.toISOString().split('T')[0]; // format: YYYY-MM-DD
            acc[date] = (acc[date] || 0) + 1;
        } catch (error) {
            console.error('Error parsing date:', order.createdAt, error);
            return acc; // Skip on error
        }
        
        return acc;
    }, {})

    // Convert to array for Recharts
    const chartData = Object.entries(ordersPerDay).map(([date, count]) => ({
        date,
        orders: count
    }))

    // If no data, show empty state
    if (chartData.length === 0) {
        return (
            <div className="w-full h-[300px] text-xs">
                <h3 className="text-base font-semibold text-slate-800 mb-4">Đơn hàng theo ngày</h3>
                <div className="flex items-center justify-center h-[230px] text-slate-400">
                    <p>Chưa có dữ liệu đơn hàng</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-[300px] text-xs">
            <h3 className="text-base font-semibold text-slate-800 mb-4">Đơn hàng theo ngày</h3>
            <ResponsiveContainer width="100%" height="88%">
                <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                        <linearGradient id="ordersFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: '#94a3b8' }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
                    <YAxis allowDecimals={false} tick={{ fill: '#94a3b8' }} tickLine={false} axisLine={false} width={30} />
                    <Tooltip
                        contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                        labelStyle={{ color: '#475569', fontWeight: 600 }}
                    />
                    <Area type="monotone" dataKey="orders" stroke="#6366f1" fill="url(#ordersFill)" strokeWidth={2.5} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
