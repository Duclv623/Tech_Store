'use client'
import { ChevronDown, Heart, Lock, LogOut, Package, Search, ShoppingCart, UserCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { clearAuth } from "@/lib/features/auth/authSlice";
import { clearAddresses } from "@/lib/features/address/addressSlice";
import { clearWishlist, selectWishlistCount } from "@/lib/features/wishlist/wishlistSlice";
import NotificationBell from "@/components/NotificationBell";

const Navbar = () => {

    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();

    const navLinkClass = (href) => {
        const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
        return `relative inline-block shrink-0 whitespace-nowrap pb-1 transition-all duration-200 hover:-translate-y-0.5 hover:text-indigo-600 ${isActive
                ? "text-indigo-600 font-medium after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-0.5 after:bg-indigo-600 after:rounded-full"
                : "text-slate-600"
            }`;
    };

    const [search, setSearch] = useState('')
    const cartCount = useSelector(state => state.cart.total)
    const user = useSelector(state => state.auth.user)
    const wishlistCount = useSelector(selectWishlistCount)

    const handleSearch = (e) => {
        e.preventDefault()
        router.push(`/shop?search=${search}`)
    }

    const handleLogout = () => {
        dispatch(clearAuth())
        dispatch(clearAddresses())
        dispatch(clearWishlist())
        toast.success('Đã đăng xuất')
        router.push('/')
    }

    return (
        <nav className="relative bg-white">
            <div className="mx-6">
                <div className="flex items-center justify-between max-w-7xl mx-auto py-4  transition-all">

                    <Link href="/" className="relative shrink-0 mr-10 text-4xl font-semibold text-slate-700 whitespace-nowrap">
                        <span className="text-green-600">go</span>cart<span className="text-green-600 text-5xl leading-0">.</span>
                        <p className="absolute text-xs font-semibold -top-1 -right-8 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-green-500">
                            plus
                        </p>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex items-center gap-4 lg:gap-6 text-slate-600">
                        <Link href="/" className={navLinkClass('/')}>Trang chủ</Link>
                        <Link href="/shop" className={navLinkClass('/shop')}>Cửa hàng</Link>
                        <Link href="/about" className={navLinkClass('/about')}>Giới thiệu</Link>
                        <Link href="/contact" className={navLinkClass('/contact')}>Liên hệ</Link>

                        <form onSubmit={handleSearch} className="hidden xl:flex items-center flex-1 min-w-0 max-w-xs text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full">
                            <Search size={18} className="text-slate-600 shrink-0" />
                            <input className="w-full bg-transparent outline-none placeholder-slate-600" type="text" placeholder="Tìm sản phẩm" value={search} onChange={(e) => setSearch(e.target.value)} required />
                        </form>

                        {/* Wishlist icon */}
                        <Link href="/account/wishlist" className="relative flex items-center gap-2 shrink-0 whitespace-nowrap text-slate-600 hover:text-red-500 transition">
                            <Heart size={18} />
                            Yêu thích
                            {wishlistCount > 0 && (
                                <span className="absolute -top-1 left-3 text-[8px] text-white bg-red-500 size-3.5 rounded-full flex items-center justify-center">{wishlistCount}</span>
                            )}
                        </Link>

                        <Link href="/cart" className="relative flex items-center gap-2 shrink-0 whitespace-nowrap text-slate-600">
                            <ShoppingCart size={18} />
                            Giỏ hàng
                            <button className="absolute -top-1 left-3 text-[8px] text-white bg-slate-600 size-3.5 rounded-full">{cartCount}</button>
                        </Link>

                        {/* Chuông thông báo (chỉ hiện khi đã đăng nhập) */}
                        <NotificationBell />

                        {user ? (
                            <div className="relative group shrink-0">
                                <button className="flex items-center gap-1.5 whitespace-nowrap text-slate-600 hover:text-indigo-600 transition cursor-pointer">
                                    <UserCircle2 size={18} />
                                    Xin chào, {user.name}
                                    <ChevronDown size={16} className="transition group-hover:rotate-180" />
                                </button>

                                {/* Dropdown — pt-3 tạo "cầu" để hover không bị mất khi chuột di chuyển xuống */}
                                <div className="absolute right-0 top-full pt-3 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition z-50">
                                    <div className="w-56 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                                        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                                            <p className="text-xs text-slate-400">Đăng nhập với</p>
                                            <p className="text-sm font-medium text-slate-700 truncate">{user.email}</p>
                                        </div>
                                        <Link
                                            href="/account/profile"
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                                        >
                                            <UserCircle2 size={16} />
                                            Thông tin cá nhân
                                        </Link>
                                        <Link
                                            href="/account/password"
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                                        >
                                            <Lock size={16} />
                                            Đổi mật khẩu
                                        </Link>
                                        <Link
                                            href="/account/orders"
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                                        >
                                            <Package size={16} />
                                            Đơn hàng của tôi
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition border-t border-slate-100"
                                        >
                                            <LogOut size={16} />
                                            Đăng xuất
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <Link href="/login" className="px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full">
                                Đăng nhập
                            </Link>
                        )}

                    </div>

                    {/* Mobile User Button  */}
                    <div className="sm:hidden">
                        {user ? (
                            <button
                                onClick={handleLogout}
                                className="px-7 py-1.5 bg-slate-200 hover:bg-slate-300 text-sm transition text-slate-700 rounded-full"
                            >
                                Đăng xuất
                            </button>
                        ) : (
                            <Link href="/login" className="px-7 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-sm transition text-white rounded-full">
                                Đăng nhập
                            </Link>
                        )}
                    </div>
                </div>
            </div>
            <hr className="border-gray-300" />
        </nav>
    )
}

export default Navbar
