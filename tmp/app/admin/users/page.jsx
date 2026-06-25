'use client'
import { useEffect, useState } from "react"
import Loading from "@/components/Loading"
import { adminAPI } from "@/lib/api"
import toast from "react-hot-toast"
import { XIcon, SearchIcon, ShieldIcon, UserIcon, Trash2Icon } from "lucide-react"

const roleOptions = [
    { value: 'USER', label: 'Người dùng', class: 'bg-slate-100 text-slate-700' },
    { value: 'ADMIN', label: 'Quản trị viên', class: 'bg-indigo-100 text-indigo-700' },
]

const roleLabel = (r) => roleOptions.find(o => o.value === r)?.label || r
const roleClass = (r) => roleOptions.find(o => o.value === r)?.class || 'bg-slate-100 text-slate-700'

export default function AdminUsers() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [selectedUser, setSelectedUser] = useState(null)
    const [filterRole, setFilterRole] = useState('ALL')
    const [confirmDelete, setConfirmDelete] = useState(null)

    const fetchUsers = async () => {
        try {
            const data = await adminAPI.getUsers()
            setUsers(Array.isArray(data) ? data : [])
        } catch (err) {
            toast.error(err.message || 'Không tải được danh sách người dùng')
        } finally {
            setLoading(false)
        }
    }

    const updateRole = async (userId, newRole) => {
        try {
            const updated = await adminAPI.updateUserRole(userId, newRole)
            setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: updated.role } : u))
            if (selectedUser?.id === userId) {
                setSelectedUser({ ...selectedUser, role: updated.role })
            }
            toast.success(`Đã đổi role thành ${roleLabel(newRole)}`)
        } catch (err) {
            toast.error(err.message || 'Cập nhật role thất bại')
        }
    }

    const deleteUser = async (userId) => {
        try {
            await adminAPI.deleteUser(userId)
            setUsers(prev => prev.filter(u => u.id !== userId))
            setSelectedUser(null)
            setConfirmDelete(null)
            toast.success('Đã xóa người dùng')
        } catch (err) {
            toast.error(err.message || 'Xóa người dùng thất bại')
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    if (loading) return <Loading />

    // Filter + search
    const filtered = users.filter(u => {
        if (filterRole !== 'ALL' && u.role !== filterRole) return false
        if (search) {
            const q = search.toLowerCase()
            return (u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.id?.toLowerCase().includes(q))
        }
        return true
    })

    const counts = {
        ALL: users.length,
        USER: users.filter(u => u.role === 'USER').length,
        ADMIN: users.filter(u => u.role === 'ADMIN').length,
    }

    return (
        <div className="pb-10">
            <h1 className="text-2xl text-slate-500 mb-5">Quản lý <span className="text-slate-800 font-medium">Người dùng</span></h1>

            {/* Search + Filter */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
                <div className="relative flex-1 max-w-sm">
                    <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Tìm theo tên, email hoặc ID..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-400 transition"
                    />
                </div>
                <div className="flex gap-2">
                    {[['ALL', 'Tất cả'], ['USER', 'User'], ['ADMIN', 'Admin']].map(([key, label]) => (
                        <button
                            key={key}
                            onClick={() => setFilterRole(key)}
                            className={`px-3 py-1.5 text-sm rounded-full border transition ${filterRole === key
                                    ? 'bg-slate-800 text-white border-slate-800'
                                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                                }`}
                        >
                            {label} ({counts[key]})
                        </button>
                    ))}
                </div>
            </div>

            {filtered.length === 0 ? (
                <p className="text-slate-400">Không tìm thấy người dùng nào.</p>
            ) : (
                <div className="overflow-x-auto rounded-md shadow border border-slate-200 bg-white">
                    <table className="w-full text-sm text-left text-slate-600">
                        <thead className="bg-slate-50 text-slate-700 text-xs uppercase tracking-wider">
                            <tr>
                                {["#", "Avatar", "Tên", "Email", "SĐT", "Role", "Hành động"].map((h, i) => (
                                    <th key={i} className="px-4 py-3 whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((u, idx) => (
                                <tr key={u.id} className="border-t border-slate-100 hover:bg-slate-50">
                                    <td className="px-4 py-3">{idx + 1}</td>
                                    <td className="px-4 py-3">
                                        <div className="size-9 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center">
                                            {u.image ? (
                                                <img src={u.image} alt={u.name} className="size-full object-cover" />
                                            ) : (
                                                <UserIcon size={16} className="text-slate-400" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 font-medium text-slate-800">{u.name || '—'}</td>
                                    <td className="px-4 py-3">{u.email}</td>
                                    <td className="px-4 py-3">{u.phone || '—'}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${roleClass(u.role)}`}>
                                            {u.role === 'ADMIN' && <ShieldIcon size={12} className="inline mr-1 -mt-0.5" />}
                                            {roleLabel(u.role)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => setSelectedUser(u)}
                                            className="text-indigo-600 hover:underline text-sm"
                                        >
                                            Chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Detail modal */}
            {selectedUser && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
                        <div className="flex items-center justify-between p-5 border-b border-slate-200 sticky top-0 bg-white rounded-t-2xl">
                            <h2 className="text-lg font-medium text-slate-800">Thông tin người dùng</h2>
                            <button onClick={() => { setSelectedUser(null); setConfirmDelete(null) }} className="text-slate-500 hover:text-slate-800">
                                <XIcon size={20} />
                            </button>
                        </div>

                        <div className="p-5 space-y-5 text-sm text-slate-600">
                            {/* Avatar + name */}
                            <div className="flex items-center gap-4">
                                <div className="size-16 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                                    {selectedUser.image ? (
                                        <img src={selectedUser.image} alt={selectedUser.name} className="size-full object-cover" />
                                    ) : (
                                        <UserIcon size={28} className="text-slate-400" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-lg font-medium text-slate-800">{selectedUser.name || 'Chưa đặt tên'}</p>
                                    <p className="text-slate-400">{selectedUser.email}</p>
                                </div>
                            </div>

                            {/* Info grid */}
                            <div className="grid grid-cols-2 gap-3 bg-slate-50 rounded-xl p-4">
                                <div>
                                    <p className="text-xs text-slate-400 mb-0.5">ID</p>
                                    <p className="font-mono text-xs break-all">{selectedUser.id}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 mb-0.5">Số điện thoại</p>
                                    <p>{selectedUser.phone || '—'}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-xs text-slate-400 mb-0.5">Địa chỉ</p>
                                    <p>{selectedUser.address || '—'}</p>
                                </div>
                                {selectedUser.bio && (
                                    <div className="col-span-2">
                                        <p className="text-xs text-slate-400 mb-0.5">Giới thiệu</p>
                                        <p>{selectedUser.bio}</p>
                                    </div>
                                )}
                            </div>

                            {/* Role management */}
                            <div className="border-t border-slate-200 pt-4">
                                <p className="text-slate-400 mb-2">Phân quyền</p>
                                <div className="flex items-center gap-3">
                                    <select
                                        value={selectedUser.role}
                                        onChange={(e) => updateRole(selectedUser.id, e.target.value)}
                                        className="border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-300 text-sm"
                                    >
                                        {roleOptions.map(r => (
                                            <option key={r.value} value={r.value}>{r.label}</option>
                                        ))}
                                    </select>
                                    <span className={`px-3 py-1.5 text-sm rounded-full font-medium ${roleClass(selectedUser.role)}`}>
                                        {selectedUser.role === 'ADMIN' && <ShieldIcon size={12} className="inline mr-1 -mt-0.5" />}
                                        {roleLabel(selectedUser.role)}
                                    </span>
                                </div>
                            </div>

                            {/* Delete */}
                            <div className="border-t border-slate-200 pt-4">
                                {confirmDelete === selectedUser.id ? (
                                    <div className="flex items-center gap-3">
                                        <p className="text-red-600 text-sm">Bạn chắc chắn muốn xóa người dùng này?</p>
                                        <button
                                            onClick={() => deleteUser(selectedUser.id)}
                                            className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                        >
                                            Xóa luôn
                                        </button>
                                        <button
                                            onClick={() => setConfirmDelete(null)}
                                            className="px-4 py-2 text-sm border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition"
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setConfirmDelete(selectedUser.id)}
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
                                    >
                                        <Trash2Icon size={14} />
                                        Xóa người dùng
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="p-5 border-t border-slate-200 flex justify-end sticky bottom-0 bg-white rounded-b-2xl">
                            <button
                                onClick={() => { setSelectedUser(null); setConfirmDelete(null) }}
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
