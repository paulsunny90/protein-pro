import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import * as addressService from '../../services/addressService';
import type { Address } from '../../services/addressService';

interface AddressState {
    addresses: Address[];
    defaultAddress: Address | null;
    loading: boolean;
    error: string | null;
}

const initialState: AddressState = {
    addresses: [],
    defaultAddress: null,
    loading: false,
    error: null,
};

// Async Thunks
export const fetchAddresses = createAsyncThunk(
    'address/fetchAddresses',
    async (_, { rejectWithValue }) => {
        try {
            return await addressService.getAllAddresses();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchDefaultAddress = createAsyncThunk(
    'address/fetchDefaultAddress',
    async (_, { rejectWithValue }) => {
        try {
            return await addressService.getDefaultAddress();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const addAddress = createAsyncThunk(
    'address/addAddress',
    async (addressData: Partial<Address>, { rejectWithValue }) => {
        try {
            return await addressService.createAddress(addressData);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const editAddress = createAsyncThunk(
    'address/editAddress',
    async ({ id, data }: { id: string; data: Partial<Address> }, { rejectWithValue }) => {
        try {
            return await addressService.updateAddress(id, data);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const removeAddress = createAsyncThunk(
    'address/removeAddress',
    async (id: string, { rejectWithValue }) => {
        try {
            await addressService.deleteAddress(id);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const markAsDefault = createAsyncThunk(
    'address/markAsDefault',
    async (id: string, { rejectWithValue }) => {
        try {
            return await addressService.setDefaultAddress(id);
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {
        clearAddressError: (state) => {
            state.error = null;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch Addresses
            .addCase(fetchAddresses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAddresses.fulfilled, (state, action: PayloadAction<Address[]>) => {
                state.loading = false;
                state.addresses = action.payload;
                state.defaultAddress = action.payload.find(addr => addr.isDefault) || null;
            })
            .addCase(fetchAddresses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Add Address
            .addCase(addAddress.pending, (state) => {
                state.loading = true;
            })
            .addCase(addAddress.fulfilled, (state, action: PayloadAction<Address>) => {
                state.loading = false;
                state.addresses.push(action.payload);
                if (action.payload.isDefault) {
                    state.addresses = state.addresses.map(addr => ({
                        ...addr,
                        isDefault: addr._id === action.payload._id
                    }));
                    state.defaultAddress = action.payload;
                }
            })
            .addCase(addAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Edit Address
            .addCase(editAddress.fulfilled, (state, action: PayloadAction<Address>) => {
                state.loading = false;
                state.addresses = state.addresses.map(addr =>
                    addr._id === action.payload._id ? action.payload : addr
                );
                if (action.payload.isDefault) {
                    state.addresses = state.addresses.map(addr => ({
                        ...addr,
                        isDefault: addr._id === action.payload._id
                    }));
                    state.defaultAddress = action.payload;
                }
            })

            // Remove Address
            .addCase(removeAddress.fulfilled, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.addresses = state.addresses.filter(addr => addr._id !== action.payload);
                if (state.defaultAddress?._id === action.payload) {
                    state.defaultAddress = null;
                }
            })

            // Mark As Default
            .addCase(markAsDefault.fulfilled, (state, action: PayloadAction<Address>) => {
                state.loading = false;
                state.addresses = state.addresses.map(addr => ({
                    ...addr,
                    isDefault: addr._id === action.payload._id
                }));
                state.defaultAddress = action.payload;
            });
    },
});

export const { clearAddressError, setError } = addressSlice.actions;
export default addressSlice.reducer;
