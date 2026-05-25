import { createSlice } from '@reduxjs/toolkit'
import { authStorage } from '@/lib/api'

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: null,
        user: null,
    },
    reducers: {
        hydrateAuth: (state) => {
            state.token = authStorage.getToken()
            state.user = authStorage.getUser()
        },
        setAuth: (state, action) => {
            const { token, user } = action.payload
            state.token = token
            state.user = user
            authStorage.set(token, user)
        },
        clearAuth: (state) => {
            state.token = null
            state.user = null
            authStorage.clear()
        },
    },
})

export const { hydrateAuth, setAuth, clearAuth } = authSlice.actions
export default authSlice.reducer
