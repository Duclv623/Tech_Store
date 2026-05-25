'use client'
import { useEffect, useRef } from 'react'
import { Provider } from 'react-redux'
import { makeStore } from '../lib/store'
import { hydrateAuth } from '../lib/features/auth/authSlice'

export default function StoreProvider({ children }) {
  const storeRef = useRef(undefined)
  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

  useEffect(() => {
    storeRef.current.dispatch(hydrateAuth())
  }, [])

  return <Provider store={storeRef.current}>{children}</Provider>
}
