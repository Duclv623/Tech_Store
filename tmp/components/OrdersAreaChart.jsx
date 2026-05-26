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
            <div className="w-full max-w-4xl h-[300px] text-xs">
                <h3 className="text-lg font-medium text-slate-800 mb-4 pt-2 text-right">
                    <span className='text-slate-500'>Đơn hàng /</span> Ngày
                </h3>
                <div className="flex items-center justify-center h-full text-slate-400">
                    <p>Chưa có dữ liệu đơn hàng</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-4xl h-[300px] text-xs">
            <h3 className="text-lg font-medium text-slate-800 mb-4 pt-2 text-right"> <span className='text-slate-500'>Đơn hàng /</span> Ngày</h3>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} label={{ value: 'Đơn hàng', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="orders" stroke="#4f46e5" fill="#8884d8" strokeWidth={2} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
