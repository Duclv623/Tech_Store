import { createSlice } from '@reduxjs/toolkit'


const ratingSlice = createSlice({
    name: 'rating',
    initialState: {
        ratings: [],
    },
    reducers: {
        setRatings: (state, action) => {
            state.ratings = action.payload || []
        },
        addRating: (state, action) => {
            const incoming = action.payload
            const idx = state.ratings.findIndex(
                r => r.orderId === incoming.orderId && r.productId === incoming.productId
            )
            if (idx >= 0) {
                state.ratings[idx] = incoming
            } else {
                state.ratings.push(incoming)
            }
        },
    }
})

export const { setRatings, addRating } = ratingSlice.actions

export default ratingSlice.reducer