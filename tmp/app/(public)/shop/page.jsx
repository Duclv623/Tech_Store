'use client'
import { Suspense, useEffect, useMemo, useState } from "react"
import ProductCard from "@/components/ProductCard"
import { MoveLeftIcon, SlidersHorizontalIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSelector } from "react-redux"
import { categoriesAPI } from "@/lib/api"

const categoryLabels = {
    Laptop: 'Laptop',
    Smartphone: 'Điện thoại',
    Audio: 'Âm thanh / Tai nghe',
    Tablet: 'Máy tính bảng',
    Accessories: 'Phụ kiện',
}

function ShopContent() {
    const searchParams = useSearchParams()
    const search = searchParams.get('search')
    const router = useRouter()
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    const products = useSelector(state => state.product.list)

    const [categories, setCategories] = useState([])
    const [selectedCategories, setSelectedCategories] = useState([])
    const [priceRange, setPriceRange] = useState({ min: '', max: '' })
    const [showFiltersMobile, setShowFiltersMobile] = useState(false)

    useEffect(() => {
        categoriesAPI.getAll()
            .then(data => setCategories(Array.isArray(data) ? data : []))
            .catch(() => {})
    }, [])

    const toggleCategory = (cat) => {
        setSelectedCategories(prev =>
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        )
    }

    const hasActiveFilter = selectedCategories.length > 0 || priceRange.min !== '' || priceRange.max !== ''

    const clearFilters = () => {
        setSelectedCategories([])
        setPriceRange({ min: '', max: '' })
    }

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
            if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) return false
            const min = priceRange.min === '' ? -Infinity : Number(priceRange.min)
            const max = priceRange.max === '' ? Infinity : Number(priceRange.max)
            if (p.price < min || p.price > max) return false
            return true
        })
    }, [products, search, selectedCategories, priceRange])

    const FilterPanel = (
        <div className="border border-slate-200 rounded-xl p-5 space-y-6 bg-white">
            <div className="flex items-center justify-between">
                <h2 className="font-semibold text-slate-700">Bộ lọc</h2>
                {hasActiveFilter && (
                    <button onClick={clearFilters} className="text-xs text-indigo-600 hover:underline">
                        Xóa lọc
                    </button>
                )}
            </div>

            {/* Danh mục */}
            <div>
                <h3 className="text-sm font-medium text-slate-600 mb-3">Danh mục</h3>
                <div className="space-y-2">
                    {categories.map(cat => (
                        <label key={cat.id} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-indigo-600 transition">
                            <input
                                type="checkbox"
                                checked={selectedCategories.includes(cat.name)}
                                onChange={() => toggleCategory(cat.name)}
                                className="accent-indigo-500"
                            />
                            {categoryLabels[cat.name] || cat.name}
                        </label>
                    ))}
                </div>
            </div>

            {/* Giá */}
            <div>
                <h3 className="text-sm font-medium text-slate-600 mb-3">Khoảng giá ({currency})</h3>
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        min="0"
                        placeholder="Từ"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                        className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                    <span className="text-slate-400">—</span>
                    <input
                        type="number"
                        min="0"
                        placeholder="Đến"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                        className="w-full border border-slate-300 rounded px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                </div>

                {/* Quick price chips */}
                <div className="flex flex-wrap gap-2 mt-3">
                    {[
                        { label: '< 5tr', min: '', max: '5000000' },
                        { label: '5 - 15tr', min: '5000000', max: '15000000' },
                        { label: '15 - 30tr', min: '15000000', max: '30000000' },
                        { label: '> 30tr', min: '30000000', max: '' },
                    ].map(p => (
                        <button
                            key={p.label}
                            onClick={() => setPriceRange({ min: p.min, max: p.max })}
                            className="px-2.5 py-1 text-xs border border-slate-200 rounded-full text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition"
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )

    return (
        <div className="min-h-[70vh] mx-6">
            <div className="max-w-7xl mx-auto">
                <h1 onClick={() => router.push('/shop')} className="text-2xl text-slate-500 my-6 flex items-center gap-2 cursor-pointer">
                    {search && <MoveLeftIcon size={20} />} Tất cả <span className="text-slate-700 font-medium">sản phẩm</span>
                </h1>

                {/* Mobile filter toggle */}
                <button
                    onClick={() => setShowFiltersMobile(v => !v)}
                    className="lg:hidden mb-4 flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:border-indigo-400 hover:text-indigo-600 transition"
                >
                    <SlidersHorizontalIcon size={16} />
                    {showFiltersMobile ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
                    {hasActiveFilter && <span className="ml-1 size-2 rounded-full bg-indigo-500" />}
                </button>

                <div className="flex gap-8 mb-32 max-lg:flex-col">
                    {/* Sidebar */}
                    <aside className={`lg:w-64 lg:flex-shrink-0 lg:block ${showFiltersMobile ? 'block' : 'hidden'}`}>
                        {FilterPanel}
                    </aside>

                    {/* Grid */}
                    <div className="flex-1">
                        <p className="text-sm text-slate-500 mb-4">Tìm thấy {filteredProducts.length} sản phẩm</p>
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
                            </div>
                        ) : (
                            <div className="text-center py-20 text-slate-400 border border-dashed border-slate-200 rounded-xl">
                                <p>Không tìm thấy sản phẩm phù hợp.</p>
                                {hasActiveFilter && (
                                    <button onClick={clearFilters} className="mt-2 text-indigo-600 hover:underline text-sm">
                                        Xóa bộ lọc
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}


export default function Shop() {
    return (
        <Suspense fallback={<div>Đang tải cửa hàng...</div>}>
            <ShopContent />
        </Suspense>
    )
}
