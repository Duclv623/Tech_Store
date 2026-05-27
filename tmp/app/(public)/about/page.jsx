import Link from 'next/link'
import {
    ShoppingBag, Truck, ShieldCheck, Headset, Users, Store,
    Package, Heart, ArrowRight, Target, Eye
} from 'lucide-react'

export const metadata = {
    title: 'Giới thiệu | GoCart',
    description: 'Tìm hiểu về GoCart — nền tảng thương mại điện tử mang đến trải nghiệm mua sắm mượt mà, an toàn và tiện lợi.',
}

const stats = [
    { icon: Users, value: '50K+', label: 'Khách hàng' },
    { icon: Package, value: '12K+', label: 'Sản phẩm' },
    { icon: Store, value: '800+', label: 'Cửa hàng' },
    { icon: Heart, value: '99%', label: 'Hài lòng' },
]

const values = [
    {
        icon: Truck,
        title: 'Giao hàng nhanh',
        desc: 'Đơn hàng được xử lý và giao đến tận tay bạn trong thời gian sớm nhất, miễn phí vận chuyển nội thành.',
        accent: '#22c55e',
    },
    {
        icon: ShieldCheck,
        title: 'Thanh toán an toàn',
        desc: 'Hệ thống bảo mật nhiều lớp, hỗ trợ COD và thanh toán online — thông tin của bạn luôn được bảo vệ.',
        accent: '#6366f1',
    },
    {
        icon: Headset,
        title: 'Hỗ trợ 24/7',
        desc: 'Đội ngũ chăm sóc khách hàng luôn sẵn sàng giải đáp mọi thắc mắc bất cứ lúc nào.',
        accent: '#f59e0b',
    },
    {
        icon: ShoppingBag,
        title: 'Sản phẩm chính hãng',
        desc: 'Tất cả sản phẩm đều từ các cửa hàng được kiểm duyệt, đảm bảo chất lượng và nguồn gốc rõ ràng.',
        accent: '#ec4899',
    },
]

export default function AboutPage() {
    return (
        <div className="text-slate-700">
            {/* Hero */}
            <section className="px-6 pt-20 pb-16 max-w-4xl mx-auto text-center">
                <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-600 mb-5">
                    Về chúng tôi
                </span>
                <h1 className="text-4xl sm:text-5xl font-semibold text-slate-800 leading-tight">
                    Mua sắm dễ dàng cùng{' '}
                    <span className="text-green-600">go</span>cart
                    <span className="text-green-600">.</span>
                </h1>
                <p className="text-slate-500 mt-6 max-w-2xl mx-auto leading-relaxed">
                    GoCart là nền tảng thương mại điện tử kết nối hàng nghìn cửa hàng với hàng triệu khách hàng.
                    Sứ mệnh của chúng tôi là mang đến trải nghiệm mua sắm trực tuyến nhanh chóng, an toàn và
                    hoàn toàn không phiền hà.
                </p>
            </section>

            {/* Stats */}
            <section className="px-6 max-w-6xl mx-auto">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                    {stats.map((s, i) => (
                        <div key={i} className="flex flex-col items-center justify-center py-8 border border-slate-200 rounded-2xl bg-slate-50/50">
                            <s.icon size={28} className="text-green-600" />
                            <p className="text-3xl font-semibold text-slate-800 mt-3">{s.value}</p>
                            <p className="text-sm text-slate-500 mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="px-6 my-20 max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
                <div className="p-8 border border-slate-200 rounded-2xl">
                    <div className="size-12 flex items-center justify-center rounded-xl bg-green-100 text-green-600 mb-5">
                        <Target size={24} />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800">Sứ mệnh</h3>
                    <p className="text-slate-500 mt-3 leading-relaxed">
                        Trao quyền cho mọi cửa hàng — dù lớn hay nhỏ — tiếp cận khách hàng trên toàn quốc,
                        đồng thời giúp người mua tìm được sản phẩm ưng ý với giá tốt nhất chỉ trong vài cú nhấp chuột.
                    </p>
                </div>
                <div className="p-8 border border-slate-200 rounded-2xl">
                    <div className="size-12 flex items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 mb-5">
                        <Eye size={24} />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800">Tầm nhìn</h3>
                    <p className="text-slate-500 mt-3 leading-relaxed">
                        Trở thành nền tảng thương mại điện tử được yêu thích nhất, nơi mọi giao dịch đều minh bạch,
                        an toàn và mang lại giá trị thực sự cho cả người mua lẫn người bán.
                    </p>
                </div>
            </section>

            {/* Values */}
            <section className="px-6 my-20 max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-2xl font-semibold text-slate-800">Vì sao chọn GoCart?</h2>
                    <p className="text-sm text-slate-500 mt-2 max-w-lg mx-auto">
                        Những giá trị cốt lõi giúp chúng tôi mang đến trải nghiệm mua sắm tốt nhất cho bạn.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {values.map((v, i) => (
                        <div key={i} className="relative px-6 pt-10 pb-6 border border-slate-200 rounded-2xl hover:shadow-md transition group">
                            <div
                                className="absolute -top-5 left-6 size-11 flex items-center justify-center rounded-xl text-white group-hover:scale-105 transition"
                                style={{ backgroundColor: v.accent }}
                            >
                                <v.icon size={22} />
                            </div>
                            <h3 className="font-medium text-slate-800">{v.title}</h3>
                            <p className="text-sm text-slate-500 mt-2 leading-relaxed">{v.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="px-6 my-20 max-w-6xl mx-auto">
                <div className="rounded-3xl bg-slate-800 text-white px-8 py-14 text-center">
                    <h2 className="text-3xl font-semibold">Sẵn sàng mua sắm chưa?</h2>
                    <p className="text-slate-300 mt-3 max-w-xl mx-auto">
                        Khám phá hàng nghìn sản phẩm chất lượng từ các cửa hàng uy tín ngay hôm nay.
                    </p>
                    <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 mt-7 px-8 py-3 bg-green-500 hover:bg-green-600 transition rounded-full font-medium"
                    >
                        Bắt đầu mua sắm
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </section>
        </div>
    )
}
