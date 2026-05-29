'use client'
import { useEffect, useState } from "react"
import Loading from "@/components/Loading"
import { ordersAPI } from "@/lib/api"
import toast from "react-hot-toast"
import { XIcon } from "lucide-react"

const statusOptions = [
    { value: 'ORDER_PLACED', label: 'Đã đặt' },
    { value: 'PROCESSING', label: 'Đang xử lý' },
    { value: 'SHIPPED', label: 'Đang giao' },
    { value: 'DELIVERED', label: 'Đã giao' },
    { value: 'CANCELLED', label: 'Đã hủy' },
]

const statusLabel = (s) => statusOptions.find(o => o.value === s)?.label || s

const statusClass = (s) => {
    switch (s) {
        case 'DELIVERED': return 'bg-green-100 text-green-700'
        case 'SHIPPED': return 'bg-blue-100 text-blue-700'
        case 'PROCESSING': return 'bg-yellow-100 text-yellow-700'
        case 'CANCELLED': return 'bg-red-100 text-red-700'
        default: return 'bg-slate-100 text-slate-700'
    }
}

export default function AdminOrders() {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [history, setHistory] = useState([])
    const [filter, setFilter] = useState('ALL')

    useEffect(() => {
        if (!selectedOrder) {
            setHistory([])
            return
        }
        ordersAPI.getHistory(selectedOrder.id)
            .then(data => setHistory(Array.isArray(data) ? data : []))
            .catch(() => setHistory([]))
    }, [selectedOrder?.id])

    const fetchOrders = async () => {
        try {
            const data = await ordersAPI.getAll()
            setOrders(Array.isArray(data) ? data : [])
        } catch (err) {
            toast.error(err.message || 'Không tải được đơn hàng')
        } finally {
            setLoading(false)
        }
    }

    const updateStatus = async (orderId, status) => {
        try {
            const updated = await ordersAPI.updateStatus(orderId, status)
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: updated.status, isPaid: updated.isPaid } : o))
            if (selectedOrder?.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: updated.status, isPaid: updated.isPaid })
                const newHistory = await ordersAPI.getHistory(orderId).catch(() => [])
                setHistory(Array.isArray(newHistory) ? newHistory : [])
            }
            toast.success('Đã cập nhật trạng thái')
        } catch (err) {
            toast.error(err.message || 'Cập nhật thất bại')
        }
    }

    const togglePaid = async (orderId, isPaid) => {
        try {
            const updated = await ordersAPI.updatePaid(orderId, isPaid)
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, isPaid: updated.isPaid } : o))
            if (selectedOrder?.id === orderId) setSelectedOrder({ ...selectedOrder, isPaid: updated.isPaid })
            toast.success(isPaid ? 'Đã đánh dấu thanh toán' : 'Đã bỏ đánh dấu thanh toán')
        } catch (err) {
            toast.error(err.message || 'Cập nhật thất bại')
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    if (loading) return <Loading />

    const visibleOrders = filter === 'ALL' ? orders : orders.filter(o => o.status === filter)

    const counts = orders.reduce((acc, o) => {
        acc[o.status] = (acc[o.status] || 0) + 1
        return acc
    }, {})

    return (
        <div className="pb-10">
            <h1 className="text-2xl text-slate-500 mb-5">Quản lý <span className="text-slate-800 font-medium">đơn hàng</span></h1>

            {/* Tabs filter status */}
            <div className="flex flex-wrap gap-2 mb-5">
                <button
                    onClick={() => setFilter('ALL')}
                    className={`px-3 py-1.5 text-sm rounded-full border transition ${
                        filter === 'ALL'
                            ? 'bg-slate-800 text-white border-slate-800'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                    }`}
                >
                    Tất cả ({orders.length})
                </button>
                {statusOptions.map(s => (
                    <button
                        key={s.value}
                        onClick={() => setFilter(s.value)}
                        className={`px-3 py-1.5 text-sm rounded-full border transition ${
                            filter === s.value
                                ? 'bg-slate-800 text-white border-slate-800'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                        }`}
                    >
                        {s.label} ({counts[s.value] || 0})
                    </button>
                ))}
            </div>

            {visibleOrders.length === 0 ? (
                <p className="text-slate-400">Không có đơn hàng nào.</p>
            ) : (
                <div className="overflow-x-auto rounded-md shadow border border-slate-200 bg-white">
                    <table className="w-full text-sm text-left text-slate-600">
                        <thead className="bg-slate-50 text-slate-700 text-xs uppercase tracking-wider">
                            <tr>
                                {["#", "Mã đơn", "Khách hàng", "Cửa hàng", "Tổng tiền", "PT", "Thanh toán", "Trạng thái", "Ngày", "Hành động"].map((h, i) => (
                                    <th key={i} className="px-4 py-3 whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {visibleOrders.map((o, idx) => (
                                <tr key={o.id} className="border-t border-slate-100 hover:bg-slate-50">
                                    <td className="px-4 py-3">{idx + 1}</td>
                                    <td className="px-4 py-3 font-mono text-xs">{o.id.slice(0, 8)}…</td>
                                    <td className="px-4 py-3 max-w-[180px] truncate">{o.address?.name || '—'}</td>
                                    <td className="px-4 py-3 font-mono text-xs">{o.storeId?.slice(0, 8)}…</td>
                                    <td className="px-4 py-3 whitespace-nowrap">{currency}{o.total?.toLocaleString()}</td>
                                    <td className="px-4 py-3 text-xs">{o.paymentMethod}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2.5 py-1 text-xs rounded-full ${o.isPaid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {o.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2.5 py-1 text-xs rounded-full ${statusClass(o.status)}`}>
                                            {statusLabel(o.status)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-xs">
                                        {o.createdAt ? new Date(o.createdAt).toLocaleDateString('vi-VN') : '—'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => setSelectedOrder(o)}
                                            className="text-indigo-600 hover:underline text-sm"
                                        >
                                            Xem
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Detail modal */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
                        <div className="flex items-center justify-between p-5 border-b border-slate-200 sticky top-0 bg-white">
                            <h2 className="text-lg font-medium text-slate-800">Chi tiết đơn hàng</h2>
                            <button onClick={() => setSelectedOrder(null)} className="text-slate-500 hover:text-slate-800">
                                <XIcon size={20} />
                            </button>
                        </div>

                        <div className="p-5 space-y-5 text-sm text-slate-600">
                            <div className="grid grid-cols-2 gap-3">
                                <p><span className="text-slate-400">Mã đơn:</span> <span className="font-mono">{selectedOrder.id}</span></p>
                                <p><span className="text-slate-400">Ngày:</span> {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}</p>
                                <p><span className="text-slate-400">Phương thức:</span> {selectedOrder.paymentMethod}</p>
                                <p className="flex items-center gap-2">
                                    <span className="text-slate-400">Thanh toán:</span>
                                    <span className={`px-2 py-0.5 text-xs rounded-full ${selectedOrder.isPaid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {selectedOrder.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                    </span>
                                </p>
                            </div>

                            {/* Toggle paid */}
                            <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                                {selectedOrder.isPaid ? (
                                    <button
                                        onClick={() => togglePaid(selectedOrder.id, false)}
                                        className="px-4 py-2 text-sm border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition"
                                    >
                                        Bỏ đánh dấu thanh toán
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => togglePaid(selectedOrder.id, true)}
                                        className="px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                    >
                                        Đánh dấu đã thanh toán
                                    </button>
                                )}
                                <p className="text-xs text-slate-400">
                                    {selectedOrder.paymentMethod === 'COD'
                                        ? 'COD: tự đánh dấu khi đơn chuyển sang "Đã giao"'
                                        : 'Stripe: chưa tích hợp webhook, cần đánh dấu thủ công'}
                                </p>
                            </div>

                            {/* Address */}
                            {selectedOrder.address && (
                                <div>
                                    <p className="text-slate-400 mb-1">Địa chỉ giao hàng</p>
                                    <p>{selectedOrder.address.name} — {selectedOrder.address.phone}</p>
                                    <p>{selectedOrder.address.street}, {selectedOrder.address.city}, {selectedOrder.address.state}, {selectedOrder.address.zip}, {selectedOrder.address.country}</p>
                                </div>
                            )}

                            {/* Items */}
                            <div>
                                <p className="text-slate-400 mb-2">Sản phẩm</p>
                                <div className="space-y-2">
                                    {(selectedOrder.orderItems || []).map((it, i) => (
                                        <div key={i} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                                            {it.product?.images?.[0] && (
                                                <img src={it.product.images[0]} alt="" className="w-12 h-12 rounded object-cover" />
                                            )}
                                            <div className="flex-1">
                                                <p className="font-medium text-slate-700">{it.product?.name || 'Sản phẩm'}</p>
                                                <p className="text-xs">SL: {it.quantity} × {currency}{it.price?.toLocaleString()}</p>
                                            </div>
                                            <p className="font-medium">{currency}{(it.quantity * it.price).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-right font-medium text-slate-800 mt-3">
                                    Tổng: {currency}{selectedOrder.total?.toLocaleString()}
                                </p>
                            </div>

                            {/* Status history */}
                            {history.length > 0 && (
                                <div className="border-t border-slate-200 pt-4">
                                    <p className="text-slate-400 mb-2">Lịch sử trạng thái</p>
                                    <ol className="relative border-l border-slate-200 ml-2 space-y-3">
                                        {history.map((h, idx) => (
                                            <li key={h.id || idx} className="ml-4">
                                                <span className={`absolute -left-1.5 size-3 rounded-full ${idx === history.length - 1 ? 'bg-indigo-500' : 'bg-slate-300'}`} />
                                                <p className="text-sm">
                                                    {h.previousStatus && (
                                                        <span className="text-slate-400">{statusLabel(h.previousStatus)} → </span>
                                                    )}
                                                    <span className="font-medium text-slate-700">{statusLabel(h.status)}</span>
                                                </p>
                                                <p className="text-xs text-slate-400">
                                                    {new Date(h.createdAt).toLocaleString('vi-VN')}
                                                    {h.changedByUserId && ` · bởi ${h.changedByUserId.slice(0, 8)}…`}
                                                </p>
                                                {h.note && <p className="text-xs text-slate-500 italic mt-0.5">{h.note}</p>}
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            )}

                            {/* Status update */}
                            <div className="border-t border-slate-200 pt-4">
                                <p className="text-slate-400 mb-2">Cập nhật trạng thái</p>
                                <div className="flex items-center gap-3">
                                    <select
                                        value={selectedOrder.status}
                                        onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                                        className="border border-slate-300 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-300"
                                    >
                                        {statusOptions.map(s => (
                                            <option key={s.value} value={s.value}>{s.label}</option>
                                        ))}
                                    </select>
                                    <span className={`px-3 py-1.5 text-sm rounded-full ${statusClass(selectedOrder.status)}`}>
                                        {statusLabel(selectedOrder.status)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 border-t border-slate-200 flex justify-end sticky bottom-0 bg-white">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
