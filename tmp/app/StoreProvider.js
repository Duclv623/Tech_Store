'use client'
import { useEffect, useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore } from '../lib/store'
import { hydrateAuth } from '../lib/features/auth/authSlice'
import { fetchWishlist } from '../lib/features/wishlist/wishlistSlice'
import { authStorage } from '../lib/api'

export default function StoreProvider({ children }) {
  const storeRef = useRef(undefined)
  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

  useEffect(() => {
    storeRef.current.dispatch(hydrateAuth())
    // Nếu user đã đăng nhập → tải wishlist ngay
    if (authStorage.getToken()) {
      storeRef.current.dispatch(fetchWishlist())
    }
  }, [])

  return <Provider store={storeRef.current}>{children}</Provider>
}

