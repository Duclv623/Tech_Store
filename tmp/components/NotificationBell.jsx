'use client'
import { useEffect, useRef, useState } from 'react'
import { Bell, CheckCheck, Package } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { notificationsAPI } from '@/lib/api'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
// Endpoint WebSocket là /ws (bỏ phần /api), giống useOrderSocket.js
const WS_BASE_URL = API_URL.replace(/\/api\/?$/, '')

function timeAgo(date) {
    try {
        return formatDistanceToNow(new Date(date), { addSuffix: true, locale: vi })
    } catch {
        return ''
    }
}

export default function NotificationBell() {
    const user = useSelector(state => state.auth.user)
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [items, setItems] = useState([])
    const panelRef = useRef(null)

    const unread = items.filter(n => !n.read).length

    // Tải danh sách ban đầu + subscribe realtime theo user
    useEffect(() => {
        if (!user?.id) {
            setItems([])
            return
        }
        let active = true

        notificationsAPI.getAll()
            .then(data => { if (active) setItems(Array.isArray(data) ? data : []) })
            .catch(() => { /* im lặng, không chặn UI */ })

        const client = new Client({
            webSocketFactory: () => new SockJS(`${WS_BASE_URL}/ws`),
            reconnectDelay: 5000,
            onConnect: () => {
                client.subscribe(`/topic/notifications/${user.id}`, (frame) => {
                    try {
                        const notif = JSON.parse(frame.body)
                        // Thêm thông báo mới lên đầu (tránh trùng nếu đã có)
                        setItems(prev => prev.some(x => x.id === notif.id) ? prev : [notif, ...prev])
                    } catch (e) {
                        console.error('Notification parse error:', e)
                    }
                })
            },
            onStompError: (frame) => console.error('STOMP error:', frame.headers['message']),
        })
        client.activate()

        return () => {
            active = false
            client.deactivate()
        }
    }, [user?.id])

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handler = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const handleClickItem = async (n) => {
        if (!n.read) {
            setItems(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))
            try { await notificationsAPI.markRead(n.id) } catch { /* ignore */ }
        }
        setOpen(false)
        if (n.link) router.push(n.link)
    }

    const handleMarkAll = async () => {
        if (unread === 0) return
        setItems(prev => prev.map(x => ({ ...x, read: true })))
        try { await notificationsAPI.markAllRead() } catch { /* ignore */ }
    }

    if (!user) return null

    return (
        <div ref={panelRef} className="relative">
            <button
                onClick={() => setOpen(o => !o)}
                className="relative flex items-center text-slate-600 hover:text-indigo-600 transition"
                aria-label="Thông báo"
            >
                <Bell size={20} />
                {unread > 0 && (
                    <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 text-[10px] leading-4 text-white bg-red-500 rounded-full text-center">
                        {unread > 9 ? '9+' : unread}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-3 w-80 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-700">Thông báo</p>
                        {unread > 0 && (
                            <button
                                onClick={handleMarkAll}
                                className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-600"
                            >
                                <CheckCheck size={14} />
                                Đánh dấu đã đọc
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {items.length === 0 ? (
                            <div className="px-4 py-10 text-center text-sm text-slate-400">
                                Chưa có thông báo nào
                            </div>
                        ) : (
                            items.map((n) => (
                                <button
                                    key={n.id}
                                    onClick={() => handleClickItem(n)}
                                    className={`w-full flex items-start gap-3 px-4 py-3 text-left border-b border-slate-50 hover:bg-slate-50 transition ${n.read ? '' : 'bg-indigo-50/50'
                                        }`}
                                >
                                    <span className="mt-0.5 text-indigo-500 shrink-0">
                                        <Package size={16} />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className="block text-sm font-medium text-slate-700">{n.title}</span>
                                        <span className="block text-xs text-slate-500 mt-0.5">{n.message}</span>
                                        <span className="block text-[11px] text-slate-400 mt-1">{timeAgo(n.createdAt)}</span>
                                    </span>
                                    {!n.read && <span className="mt-1.5 size-2 rounded-full bg-indigo-500 shrink-0" />}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
