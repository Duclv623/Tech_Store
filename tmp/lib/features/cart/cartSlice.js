import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { authStorage, cartAPI } from '@/lib/api'

const GUEST_CART_KEY = 'gocart_guest_cart'

const normalizeCart = (items = {}) => {
    const normalized = {}
    Object.entries(items || {}).forEach(([productId, quantity]) => {
        const count = Number(quantity)
        if (productId && Number.isFinite(count) && count > 0) {
            normalized[productId] = Math.floor(count)
        }
    })
    return normalized
}

const getTotal = (items = {}) => Object.values(items).reduce((sum, quantity) => sum + Number(quantity || 0), 0)

const getGuestCart = () => {
    if (typeof window === 'undefined') return {}
    try {
        return normalizeCart(JSON.parse(window.localStorage.getItem(GUEST_CART_KEY) || '{}'))
    } catch (_) {
        return {}
    }
}

const saveGuestCart = (items) => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(GUEST_CART_KEY, JSON.stringify(normalizeCart(items)))
}

const clearGuestCart = () => {
    if (typeof window === 'undefined') return
    window.localStorage.removeItem(GUEST_CART_KEY)
}

const persistCart = async (items) => {
    const normalized = normalizeCart(items)
    if (authStorage.getToken()) {
        return normalizeCart(await cartAPI.update(normalized))
    }
    saveGuestCart(normalized)
    return normalized
}

export const hydrateCart = createAsyncThunk('cart/hydrateCart', async () => {
    if (authStorage.getToken()) {
        return normalizeCart(await cartAPI.get())
    }
    return getGuestCart()
})

export const mergeGuestCart = createAsyncThunk('cart/mergeGuestCart', async () => {
    const guestCart = getGuestCart()
    if (!authStorage.getToken()) return guestCart

    const merged = normalizeCart(await cartAPI.merge(guestCart))
    clearGuestCart()
    return merged
})

export const addToCart = createAsyncThunk('cart/addToCart', async ({ productId }, { getState }) => {
    const items = { ...getState().cart.cartItems }
    items[productId] = (items[productId] || 0) + 1
    return persistCart(items)
})

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async ({ productId }, { getState }) => {
    const items = { ...getState().cart.cartItems }
    if (items[productId]) {
        items[productId] -= 1
        if (items[productId] <= 0) delete items[productId]
    }
    return persistCart(items)
})

export const deleteItemFromCart = createAsyncThunk('cart/deleteItemFromCart', async ({ productId }, { getState }) => {
    const items = { ...getState().cart.cartItems }
    delete items[productId]
    return persistCart(items)
})

export const clearCart = createAsyncThunk('cart/clearCart', async () => {
    if (authStorage.getToken()) {
        await cartAPI.clear()
        return {}
    }
    saveGuestCart({})
    return {}
})

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        total: 0,
        cartItems: {},
        loading: false,
        error: null,
    },
    reducers: {
        setCart: (state, action) => {
            state.cartItems = normalizeCart(action.payload)
            state.total = getTotal(state.cartItems)
            state.error = null
        },
    },
    extraReducers: (builder) => {
        const pending = (state) => {
            state.loading = true
            state.error = null
        }
        const fulfilled = (state, action) => {
            state.loading = false
            state.cartItems = normalizeCart(action.payload)
            state.total = getTotal(state.cartItems)
        }
        const rejected = (state, action) => {
            state.loading = false
            state.error = action.error?.message || 'Unable to sync cart'
        }

        builder
            .addCase(hydrateCart.pending, pending)
            .addCase(hydrateCart.fulfilled, fulfilled)
            .addCase(hydrateCart.rejected, rejected)
            .addCase(mergeGuestCart.pending, pending)
            .addCase(mergeGuestCart.fulfilled, fulfilled)
            .addCase(mergeGuestCart.rejected, rejected)
            .addCase(addToCart.pending, pending)
            .addCase(addToCart.fulfilled, fulfilled)
            .addCase(addToCart.rejected, rejected)
            .addCase(removeFromCart.pending, pending)
            .addCase(removeFromCart.fulfilled, fulfilled)
            .addCase(removeFromCart.rejected, rejected)
            .addCase(deleteItemFromCart.pending, pending)
            .addCase(deleteItemFromCart.fulfilled, fulfilled)
            .addCase(deleteItemFromCart.rejected, rejected)
            .addCase(clearCart.pending, pending)
            .addCase(clearCart.fulfilled, fulfilled)
            .addCase(clearCart.rejected, rejected)
    }
})

export const { setCart } = cartSlice.actions

export default cartSlice.reducer
