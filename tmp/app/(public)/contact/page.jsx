'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { MapPin, Phone, Mail, Clock, Send, Facebook, Instagram, Youtube } from 'lucide-react'

const infoItems = [
    { icon: MapPin, title: 'Địa chỉ', lines: ['123 Đường Lê Lợi, Quận 1', 'TP. Hồ Chí Minh, Việt Nam'] },
    { icon: Phone, title: 'Điện thoại', lines: ['1900 1234', '+84 28 1234 5678'] },
    { icon: Mail, title: 'Email', lines: ['support@gocart.vn', 'sales@gocart.vn'] },
    { icon: Clock, title: 'Giờ làm việc', lines: ['Thứ 2 - Thứ 7: 8:00 - 21:00', 'Chủ nhật: 9:00 - 18:00'] },
]

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
    const [sending, setSending] = useState(false)

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSending(true)
        // Chưa có endpoint backend cho liên hệ — giả lập gửi thành công
        await new Promise((r) => setTimeout(r, 700))
        toast.success('Đã gửi! Chúng tôi sẽ phản hồi sớm nhất.')
        setForm({ name: '', email: '', subject: '', message: '' })
        setSending(false)
    }

    return (
        <div className="text-slate-700">
            {/* Hero */}
            <section className="px-6 pt-20 pb-12 max-w-4xl mx-auto text-center">
                <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-600 mb-5">
                    Liên hệ
                </span>
                <h1 className="text-4xl sm:text-5xl font-semibold text-slate-800 leading-tight">
                    Chúng tôi luôn sẵn sàng lắng nghe
                </h1>
                <p className="text-slate-500 mt-6 max-w-2xl mx-auto leading-relaxed">
                    Có thắc mắc về đơn hàng, sản phẩm hay muốn hợp tác bán hàng? Hãy để lại lời nhắn,
                    đội ngũ GoCart sẽ phản hồi trong thời gian sớm nhất.
                </p>
            </section>

            {/* Info cards */}
            <section className="px-6 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {infoItems.map((item, i) => (
                        <div key={i} className="flex flex-col items-center text-center py-8 px-5 border border-slate-200 rounded-2xl bg-slate-50/50">
                            <div className="size-12 flex items-center justify-center rounded-xl bg-green-100 text-green-600 mb-4">
                                <item.icon size={22} />
                            </div>
                            <h3 className="font-medium text-slate-800">{item.title}</h3>
                            {item.lines.map((line, j) => (
                                <p key={j} className="text-sm text-slate-500 mt-1">{line}</p>
                            ))}
                        </div>
                    ))}
                </div>
            </section>

            {/* Form + Map */}
            <section className="px-6 my-20 max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
                {/* Form */}
                <div className="p-8 border border-slate-200 rounded-2xl">
                    <h2 className="text-2xl font-semibold text-slate-800">Gửi lời nhắn</h2>
                    <p className="text-sm text-slate-500 mt-1 mb-6">Điền thông tin bên dưới, chúng tôi sẽ liên hệ lại với bạn.</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Họ tên</label>
                                <input
                                    name="name" value={form.name} onChange={handleChange} required
                                    placeholder="Nguyễn Văn A"
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-300"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Email</label>
                                <input
                                    type="email" name="email" value={form.email} onChange={handleChange} required
                                    placeholder="email@example.com"
                                    className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-300"
                                />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Tiêu đề</label>
                            <input
                                name="subject" value={form.subject} onChange={handleChange} required
                                placeholder="Tôi cần hỗ trợ về..."
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-300"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Nội dung</label>
                            <textarea
                                name="message" rows={5} value={form.message} onChange={handleChange} required
                                placeholder="Nhập nội dung lời nhắn của bạn..."
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-green-300 resize-none"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={sending}
                            className="inline-flex items-center gap-2 px-7 py-2.5 bg-green-500 hover:bg-green-600 disabled:opacity-60 transition text-white rounded-full font-medium"
                        >
                            {sending ? 'Đang gửi...' : <>Gửi lời nhắn <Send size={16} /></>}
                        </button>
                    </form>
                </div>

                {/* Map + socials */}
                <div className="flex flex-col gap-6">
                    <div className="flex-1 min-h-[300px] rounded-2xl overflow-hidden border border-slate-200">
                        <iframe
                            title="Bản đồ GoCart"
                            src="https://www.google.com/maps?q=Ho+Chi+Minh+City&output=embed"
                            className="w-full h-full min-h-[300px]"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                    <div className="p-6 border border-slate-200 rounded-2xl">
                        <h3 className="font-medium text-slate-800">Kết nối với chúng tôi</h3>
                        <p className="text-sm text-slate-500 mt-1 mb-4">Theo dõi GoCart trên mạng xã hội để cập nhật ưu đãi mới nhất.</p>
                        <div className="flex gap-3">
                            <a href="#" className="size-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-green-100 hover:text-green-600 text-slate-600 transition">
                                <Facebook size={18} />
                            </a>
                            <a href="#" className="size-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-green-100 hover:text-green-600 text-slate-600 transition">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="size-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-green-100 hover:text-green-600 text-slate-600 transition">
                                <Youtube size={18} />
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
