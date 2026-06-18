import { PlusIcon, SquarePenIcon, XIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import AddressModal from './AddressModal';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { fetchAddresses } from '@/lib/features/address/addressSlice';
import { clearCart } from '@/lib/features/cart/cartSlice';
import { ordersAPI } from '@/lib/api';

const OrderSummary = ({ totalPrice, items }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';

    const router = useRouter();
    const dispatch = useDispatch();

    const addressList = useSelector(state => state.address.list);
    const user = useSelector(state => state.auth.user);

    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [couponCodeInput, setCouponCodeInput] = useState('');
    const [coupon, setCoupon] = useState('');

    useEffect(() => {
        if (user?.id) {
            dispatch(fetchAddresses(user.id));
        }
    }, [dispatch, user?.id]);

    useEffect(() => {
        if (!selectedAddress && addressList.length > 0) {
            setSelectedAddress(addressList[0]);
        }
    }, [addressList, selectedAddress]);

    // Đồng bộ địa chỉ đang chọn với danh sách sau khi sửa
    useEffect(() => {
        if (selectedAddress?.id) {
            const fresh = addressList.find(a => a.id === selectedAddress.id);
            if (fresh && fresh !== selectedAddress) setSelectedAddress(fresh);
        }
    }, [addressList, selectedAddress]);

    const handleCouponCode = async (event) => {
        event.preventDefault();
        
    }

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!user?.id) {
            toast.error('Vui lòng đăng nhập trước');
            return;
        }
        if (!selectedAddress?.id) {
            toast.error('Vui lòng chọn địa chỉ giao hàng');
            return;
        }
        if (!items || items.length === 0) {
            toast.error('Giỏ hàng trống');
            return;
        }
        try {
            await ordersAPI.place({
                addressId: selectedAddress.id,
                paymentMethod,
                couponCode: coupon?.code || null,
                items: items.map(it => ({ productId: it.id, quantity: it.quantity })),
            });
            dispatch(clearCart());
            toast.success('Đặt hàng thành công');
            router.push('/account/orders');
        } catch (err) {
            toast.error(err.message || 'Đặt hàng thất bại');
            throw err;
        }
    }

    return (
        <div className='w-full max-w-lg lg:max-w-[340px] bg-slate-50/30 border border-slate-200 text-slate-500 text-sm rounded-xl p-7'>
            <h2 className='text-xl font-medium text-slate-600'>Tóm tắt thanh toán</h2>
            <p className='text-slate-400 text-xs my-4'>Phương thức thanh toán</p>
            <div className='flex gap-2 items-center'>
                <input type="radio" id="COD" onChange={() => setPaymentMethod('COD')} checked={paymentMethod === 'COD'} className='accent-gray-500' />
                <label htmlFor="COD" className='cursor-pointer'>Thanh toán khi nhận hàng (COD)</label>
            </div>
            <div className='flex gap-2 items-center mt-1'>
                <input type="radio" id="STRIPE" name='payment' onChange={() => setPaymentMethod('STRIPE')} checked={paymentMethod === 'STRIPE'} className='accent-gray-500' />
                <label htmlFor="STRIPE" className='cursor-pointer'>Thanh toán qua Stripe</label>
            </div>
            <div className='my-4 py-4 border-y border-slate-200 text-slate-400'>
                <p>Địa chỉ</p>
                {
                    selectedAddress ? (
                        <div className='flex flex-col gap-1'>
                            <div className='flex gap-2 items-center'>
                                <p>{selectedAddress.name}, {selectedAddress.city}, {selectedAddress.state}, {selectedAddress.zip}</p>
                                <SquarePenIcon onClick={() => { setEditingAddress(selectedAddress); setShowAddressModal(true); }} className='cursor-pointer shrink-0' size={18} />
                            </div>
                            <button type='button' onClick={() => setSelectedAddress(null)} className='text-xs text-indigo-600 hover:underline w-fit'>Chọn địa chỉ khác</button>
                        </div>
                    ) : (
                        <div>
                            {
                                addressList.length > 0 && (
                                    <select className='border border-slate-400 p-2 w-full my-3 outline-none rounded' onChange={(e) => setSelectedAddress(addressList[e.target.value])} >
                                        <option value="">Chọn địa chỉ</option>
                                        {
                                            addressList.map((address, index) => (
                                                <option key={index} value={index}>{address.name}, {address.city}, {address.state}, {address.zip}</option>
                                            ))
                                        }
                                    </select>
                                )
                            }
                            <button className='flex items-center gap-1 text-slate-600 mt-1' onClick={() => { setEditingAddress(null); setShowAddressModal(true); }} >Thêm địa chỉ <PlusIcon size={18} /></button>
                        </div>
                    )
                }
            </div>
            <div className='pb-4 border-b border-slate-200'>
                <div className='flex justify-between'>
                    <div className='flex flex-col gap-1 text-slate-400'>
                        <p>Tạm tính:</p>
                        <p>Phí vận chuyển:</p>
                        {coupon && <p>Mã giảm giá:</p>}
                    </div>
                    <div className='flex flex-col gap-1 font-medium text-right'>
                        <p>{currency}{totalPrice.toLocaleString()}</p>
                        <p>Miễn phí</p>
                        {coupon && <p>{`-${currency}${(coupon.discount / 100 * totalPrice).toFixed(2)}`}</p>}
                    </div>
                </div>
                {
                    !coupon ? (
                        <form onSubmit={e => toast.promise(handleCouponCode(e), { loading: 'Đang kiểm tra mã giảm giá...' })} className='flex justify-center gap-3 mt-3'>
                            <input onChange={(e) => setCouponCodeInput(e.target.value)} value={couponCodeInput} type="text" placeholder='Mã giảm giá' className='border border-slate-400 p-1.5 rounded w-full outline-none' />
                            <button className='bg-slate-600 text-white px-3 rounded hover:bg-slate-800 active:scale-95 transition-all'>Áp dụng</button>
                        </form>
                    ) : (
                        <div className='w-full flex items-center justify-center gap-2 text-xs mt-2'>
                            <p>Mã: <span className='font-semibold ml-1'>{coupon.code.toUpperCase()}</span></p>
                            <p>{coupon.description}</p>
                            <XIcon size={18} onClick={() => setCoupon('')} className='hover:text-red-700 transition cursor-pointer' />
                        </div>
                    )
                }
            </div>
            <div className='flex justify-between py-4'>
                <p>Tổng cộng:</p>
                <p className='font-medium text-right'>{currency}{coupon ? (totalPrice - (coupon.discount / 100 * totalPrice)).toFixed(2) : totalPrice.toLocaleString()}</p>
            </div>
            <button onClick={e => toast.promise(handlePlaceOrder(e), { loading: 'Đang đặt hàng...' })} className='w-full bg-slate-700 text-white py-2.5 rounded hover:bg-slate-900 active:scale-95 transition-all'>Đặt hàng</button>

            {showAddressModal && (
                <AddressModal
                    editAddress={editingAddress}
                    setShowAddressModal={(v) => { setShowAddressModal(v); if (!v) setEditingAddress(null); }}
                />
            )}

        </div>
    )
}

export default OrderSummary