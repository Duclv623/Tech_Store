import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { wishlistAPI } from '@/lib/api'

// Fetch wishlist từ server
export const fetchWishlist = createAsyncThunk(
    'wishlist/fetch',
    async (_, { rejectWithValue }) => {
        try {
            return await wishlistAPI.getAll()
        } catch (err) {
            return rejectWithValue(err.message)
        }
    }
)

// Toggle yêu thích (thêm hoặc bỏ)
export const toggleWishlist = createAsyncThunk(
    'wishlist/toggle',
    async (productId, { rejectWithValue }) => {
        try {
            return await wishlistAPI.toggle(productId)
        } catch (err) {
            return rejectWithValue(err.message)
        }
    }
)

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState: {
        items: [],       // mảng Wishlist objects [{id, userId, productId, ...}]
        loading: false,
        error: null,
    },
    reducers: {
        clearWishlist: (state) => {
            state.items = []
        },
    },
    extraReducers: (builder) => {
        builder
            // fetch
            .addCase(fetchWishlist.pending, (state) => { state.loading = true })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.loading = false
                state.items = action.payload || []
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })

            // toggle – optimistic update
            .addCase(toggleWishlist.fulfilled, (state, action) => {
                const { added, productId } = action.payload
                if (added) {
                    // Thêm vào local state nếu chưa có
                    if (!state.items.find(i => i.productId === productId)) {
                        state.items.push({ productId })
                    }
                } else {
                    // Xóa khỏi local state
                    state.items = state.items.filter(i => i.productId !== productId)
                }
            })
    },
})

export const { clearWishlist } = wishlistSlice.actions

// Selectors
export const selectWishlistItems = (state) => state.wishlist.items
export const selectIsWishlisted = (productId) => (state) =>
    state.wishlist.items.some(i => i.productId === productId)
export const selectWishlistCount = (state) => state.wishlist.items.length

export default wishlistSlice.reducer
