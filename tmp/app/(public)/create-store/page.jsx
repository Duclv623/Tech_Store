'use client'
import { assets } from "@/assets/assets"
import { useEffect, useState } from "react"
import Image from "next/image"
import toast from "react-hot-toast"
import Loading from "@/components/Loading"

export default function CreateStore() {

    const [alreadySubmitted, setAlreadySubmitted] = useState(false)
    const [status, setStatus] = useState("")
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")

    const [storeInfo, setStoreInfo] = useState({
        name: "",
        username: "",
        description: "",
        email: "",
        contact: "",
        address: "",
        image: ""
    })

    const onChangeHandler = (e) => {
        setStoreInfo({ ...storeInfo, [e.target.name]: e.target.value })
    }

    const fetchSellerStatus = async () => {
        // Logic to check if the store is already submitted


        setLoading(false)
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        // Logic to submit the store details


    }

    useEffect(() => {
        fetchSellerStatus()
    }, [])

    return !loading ? (
        <>
            {!alreadySubmitted ? (
                <div className="mx-6 min-h-[70vh] my-16">
                    <form onSubmit={e => toast.promise(onSubmitHandler(e), { loading: "Đang gửi dữ liệu..." })} className="max-w-7xl mx-auto flex flex-col items-start gap-3 text-slate-500">
                        {/* Title */}
                        <div>
                            <h1 className="text-3xl ">Mở <span className="text-slate-800 font-medium">cửa hàng</span></h1>
                            <p className="max-w-lg">Để trở thành người bán trên GoCart, vui lòng gửi thông tin cửa hàng để chúng tôi xét duyệt. Cửa hàng của bạn sẽ được kích hoạt sau khi quản trị viên xác minh.</p>
                        </div>

                        <label className="mt-10 cursor-pointer">
                            Logo cửa hàng
                            <Image src={storeInfo.image ? URL.createObjectURL(storeInfo.image) : assets.upload_area} className="rounded-lg mt-2 h-16 w-auto" alt="" width={150} height={100} />
                            <input type="file" accept="image/*" onChange={(e) => setStoreInfo({ ...storeInfo, image: e.target.files[0] })} hidden />
                        </label>

                        <p>Tên đăng nhập</p>
                        <input name="username" onChange={onChangeHandler} value={storeInfo.username} type="text" placeholder="Nhập tên đăng nhập của cửa hàng" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded" />

                        <p>Tên cửa hàng</p>
                        <input name="name" onChange={onChangeHandler} value={storeInfo.name} type="text" placeholder="Nhập tên cửa hàng" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded" />

                        <p>Mô tả</p>
                        <textarea name="description" onChange={onChangeHandler} value={storeInfo.description} rows={5} placeholder="Nhập mô tả cửa hàng" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded resize-none" />

                        <p>Email</p>
                        <input name="email" onChange={onChangeHandler} value={storeInfo.email} type="email" placeholder="Nhập email cửa hàng" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded" />

                        <p>Số điện thoại liên hệ</p>
                        <input name="contact" onChange={onChangeHandler} value={storeInfo.contact} type="text" placeholder="Nhập số điện thoại liên hệ của cửa hàng" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded" />

                        <p>Địa chỉ</p>
                        <textarea name="address" onChange={onChangeHandler} value={storeInfo.address} rows={5} placeholder="Nhập địa chỉ cửa hàng" className="border border-slate-300 outline-slate-400 w-full max-w-lg p-2 rounded resize-none" />

                        <button className="bg-slate-800 text-white px-12 py-2 rounded mt-10 mb-40 active:scale-95 hover:bg-slate-900 transition ">Gửi</button>
                    </form>
                </div>
            ) : (
                <div className="min-h-[80vh] flex flex-col items-center justify-center">
                    <p className="sm:text-2xl lg:text-3xl mx-5 font-semibold text-slate-500 text-center max-w-2xl">{message}</p>
                    {status === "approved" && <p className="mt-5 text-slate-400">Đang chuyển đến trang quản trị trong <span className="font-semibold">5 giây</span></p>}
                </div>
            )}
        </>
    ) : (<Loading />)
}