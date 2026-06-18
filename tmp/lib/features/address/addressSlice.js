import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { addressesAPI } from '@/lib/api'

export const fetchAddresses = createAsyncThunk(
    'address/fetchAddresses',
    async (userId, { rejectWithValue }) => {
        try {
            return await addressesAPI.getByUser(userId)
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const createAddress = createAsyncThunk(
    'address/createAddress',
    async (payload, { rejectWithValue }) => {
        try {
            return await addressesAPI.create(payload)
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const updateAddress = createAsyncThunk(
    'address/updateAddress',
    async ({ id, ...payload }, { rejectWithValue }) => {
        try {
            return await addressesAPI.update(id, payload)
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

const addressSlice = createSlice({
    name: 'address',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {
        addAddress: (state, action) => {
            state.list.push(action.payload)
        },
        clearAddresses: (state) => {
            state.list = []
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAddresses.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchAddresses.fulfilled, (state, action) => {
                state.loading = false
                state.list = action.payload || []
            })
            .addCase(fetchAddresses.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(createAddress.fulfilled, (state, action) => {
                state.list.push(action.payload)
            })
            .addCase(updateAddress.fulfilled, (state, action) => {
                const idx = state.list.findIndex(a => a.id === action.payload.id)
                if (idx !== -1) state.list[idx] = action.payload
            })
    },
})

export const { addAddress, clearAddresses } = addressSlice.actions
export default addressSlice.reducer
