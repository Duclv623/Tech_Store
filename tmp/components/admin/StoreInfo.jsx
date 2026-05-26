'use client'
import Image from "next/image"
import { MapPin, Mail, Phone } from "lucide-react"

const StoreInfo = ({store}) => {
    if (!store) {
        return <div>Không có dữ liệu cửa hàng</div>;
    }

    return (
        <div className="flex-1 space-y-2 text-sm">
            <Image 
                width={100} 
                height={100} 
                src={store.logo || '/placeholder.png'}
                alt={store.name || 'Cửa hàng'}
                className="max-w-20 max-h-20 object-contain shadow rounded-full max-sm:mx-auto"
            />
            <div className="flex flex-col sm:flex-row gap-3 items-center">
                <h3 className="text-xl font-semibold text-slate-800"> {store.name || 'Cửa hàng không xác định'} </h3>
                {store.username && <span className="text-sm">@{store.username}</span>}

                {/* Status Badge */}
                {store.status && (
                    <span
                        className={`text-xs font-semibold px-4 py-1 rounded-full ${store.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : store.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                            }`}
                    >
                        {store.status === 'pending'
                            ? 'Chờ duyệt'
                            : store.status === 'rejected'
                            ? 'Từ chối'
                            : store.status === 'approved'
                            ? 'Đã duyệt'
                            : store.status}
                    </span>
                )}
            </div>

            <p className="text-slate-600 my-5 max-w-2xl">{store.description}</p>
            <p className="flex items-center gap-2"> <MapPin size={16} /> {store.address}</p>
            <p className="flex items-center gap-2"><Phone size={16} /> {store.contact}</p>
            <p className="flex items-center gap-2"><Mail size={16} />  {store.email}</p>
            {store.createdAt && (
                <p className="text-slate-700 mt-5">Đăng ký vào <span className="text-xs">{new Date(store.createdAt).toLocaleDateString()}</span></p>
            )}
            {store.user && (
                <div className="flex items-center gap-2 text-sm mt-2">
                    <Image
                        width={36}
                        height={36}
                        src={store.user.image || '/placeholder.png'}
                        alt={store.user.name || 'Người dùng'}
                        className="w-9 h-9 rounded-full"
                    />
                    <div>
                        <p className="text-slate-600 font-medium">{store.user.name || 'Không xác định'}</p>
                        <p className="text-slate-400">{store.user.email || ''}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default StoreInfo