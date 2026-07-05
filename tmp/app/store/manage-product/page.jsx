'use client'
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import Image from "next/image"
import Loading from "@/components/Loading"
import { assets } from "@/assets/assets"
import { authStorage, productsAPI, storesAPI } from "@/lib/api"

export default function StoreManageProducts() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    const PAGE_SIZE = 12

    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])
    const [page, setPage] = useState(1)
    const [draftStock, setDraftStock] = useState({})

    const fetchProducts = async () => {
        try {
            const user = authStorage.getUser()
            if (!user?.id) throw new Error("Chưa đăng nhập")
            const store = await storesAPI.getByUserId(user.id)
            if (!store?.id) throw new Error("Bạn chưa có cửa hàng")
            const data = await productsAPI.getByStore(store.id)
            setProducts(Array.isArray(data) ? data : [])
        } catch (err) {
            toast.error(err.message || "Không tải được sản phẩm")
        } finally {
            setLoading(false)
        }
    }

    const toggleStock = async (productId) => {
        const product = products.find(p => p.id === productId)
        if (!product) return
        // updateProduct ghi đè toàn bộ field -> phải gửi nguyên product, chỉ đảo inStock
        const updated = await productsAPI.update(productId, { ...product, inStock: !product.inStock })
        setProducts(prev => prev.map(p => p.id === productId ? { ...p, inStock: updated.inStock } : p))
    }

    // Giá trị hiển thị trong ô kho: ưu tiên bản nháp đang gõ, nếu không lấy từ product
    const stockValue = (product) =>
        draftStock[product.id] ?? String(product.stockQuantity ?? 0)

    // Lưu kho khi rời ô / nhấn Enter; hết hàng (0) thì tự tắt bán
    const commitStock = async (product) => {
        const raw = draftStock[product.id]
        setDraftStock(prev => { const next = { ...prev }; delete next[product.id]; return next })
        if (raw === undefined) return
        const qty = Math.max(0, Math.floor(Number(raw) || 0))
        if (qty === (product.stockQuantity ?? 0)) return
        try {
            const updated = await productsAPI.update(product.id, { ...product, stockQuantity: qty, inStock: qty > 0 })
            setProducts(prev => prev.map(p => p.id === product.id
                ? { ...p, stockQuantity: updated.stockQuantity, inStock: updated.inStock }
                : p))
            toast.success("Đã cập nhật kho")
        } catch (e) {
            toast.error(e?.message || "Cập nhật kho thất bại")
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    if (loading) return <Loading />

    const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE))
    const currentPage = Math.min(page, totalPages)
    const pageProducts = products.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

    return (
        <>
            <h1 className="text-2xl text-slate-500 mb-5">Quản lý <span className="text-slate-800 font-medium">Sản phẩm</span></h1>
            {products.length === 0 ? (
                <p className="text-slate-400">Cửa hàng chưa có sản phẩm nào.</p>
            ) : (
            <table className="w-full max-w-4xl text-left  ring ring-slate-200  rounded overflow-hidden text-sm">
                <thead className="bg-slate-50 text-gray-700 uppercase tracking-wider">
                    <tr>
                        <th className="px-4 py-3">Tên sản phẩm</th>
                        <th className="px-4 py-3 hidden md:table-cell">Mô tả</th>
                        <th className="px-4 py-3 hidden md:table-cell">Giá niêm yết</th>
                        <th className="px-4 py-3">Giá bán</th>
                        <th className="px-4 py-3">Kho</th>
                        <th className="px-4 py-3">Thao tác</th>
                    </tr>
                </thead>
                <tbody className="text-slate-700">
                    {pageProducts.map((product) => (
                        <tr key={product.id} className="border-t border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-3">
                                <div className="flex gap-2 items-center">
                                    <Image width={40} height={40} className='p-1 shadow rounded cursor-pointer' src={product.images?.[0] || assets.upload_area} alt="" />
                                    {product.name}
                                </div>
                            </td>
                            <td className="px-4 py-3 max-w-md text-slate-600 hidden md:table-cell truncate">{product.description}</td>
                            <td className="px-4 py-3 hidden md:table-cell">{currency} {(product.mrp || 0).toLocaleString()}</td>
                            <td className="px-4 py-3">{currency} {(product.price || 0).toLocaleString()}</td>
                            <td className="px-4 py-3">
                                <input
                                    type="number"
                                    min={0}
                                    step={1}
                                    value={stockValue(product)}
                                    onChange={e => setDraftStock(prev => ({ ...prev, [product.id]: e.target.value }))}
                                    onBlur={() => commitStock(product)}
                                    onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur() }}
                                    className={`w-20 p-1.5 text-center border rounded outline-none ${(product.stockQuantity ?? 0) === 0 ? 'border-red-300 text-red-600' : 'border-slate-200'}`}
                                />
                            </td>
                            <td className="px-4 py-3 text-center">
                                <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                                    <input type="checkbox" className="sr-only peer" onChange={() => toast.promise(toggleStock(product.id), { loading: "Đang cập nhật dữ liệu...", success: "Đã cập nhật", error: e => e?.message || "Cập nhật thất bại" })} checked={!!product.inStock} />
                                    <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors duration-200"></div>
                                    <span className="dot absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-4"></span>
                                </label>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            )}

            {totalPages > 1 && (
                <div className="flex items-center gap-1 mt-4">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 text-sm rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
                    >
                        Trước
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                        <button
                            key={n}
                            onClick={() => setPage(n)}
                            className={`px-3 py-1.5 text-sm rounded border transition ${n === currentPage
                                ? 'bg-slate-800 text-white border-slate-800'
                                : 'border-slate-200 hover:bg-slate-50'}`}
                        >
                            {n}
                        </button>
                    ))}
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 text-sm rounded border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
                    >
                        Sau
                    </button>
                </div>
            )}
        </>
    )
}
