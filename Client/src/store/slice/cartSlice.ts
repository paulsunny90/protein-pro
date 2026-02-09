import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { formatImageUrl } from '../../utils/imageUtils';

// Types
export interface CartItem {
    product: any; // Ideally this should be Product type but populate makes it an object
    quantity: number;
    size: string;
    _id?: string;
}

interface CartState {
    items: CartItem[];
    loading: boolean;
    error: string | null;
}

const initialState: CartState = {
    items: [],
    loading: false,
    error: null,
};

// Async Thunks

// Fetch Cart
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/cart');
            // Backend returns { items: [...] } or the cart object with items populated
            const items = response.data.items || [];

            // Format product images in cart items
            return items.map((item: any) => ({
                ...item,
                product: item.product ? {
                    ...item.product,
                    image: formatImageUrl(item.product.imageUrl || item.product.image)
                } : item.product
            }));
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
        }
    }
);

// Add to Cart
export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async ({ productId, quantity, size }: { productId: string; quantity: number; size: string }, { rejectWithValue }) => {
        try {
            const response = await api.post('/cart/add', { productId, quantity, size });
            return response.data.cart.items; // Backend returns updated cart
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
        }
    }
);

// Remove from Cart
export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async (productId: string, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/cart/remove/${productId}`);
            return response.data.cart.items;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart');
        }
    }
);

// Update Cart Item
export const updateCartItem = createAsyncThunk(
    'cart/updateCartItem',
    async ({ productId, quantity, size }: { productId: string; quantity: number; size: string }, { rejectWithValue }) => {
        try {
            const response = await api.put('/cart/update', { productId, quantity, size });
            return response.data.cart.items;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update cart');
        }
    }
);

// Clear Cart
export const clearCart = createAsyncThunk(
    'cart/clearCart',
    async (_, { rejectWithValue }) => {
        try {
            await api.delete('/cart/clear');
            return [];
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Add
            .addCase(addToCart.fulfilled, (state, action) => {
                state.items = action.payload;
            })
            // Remove
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.items = action.payload;
            })
            // Update
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.items = action.payload;
            })
            // Clear
            .addCase(clearCart.fulfilled, (state) => {
                state.items = [];
            });
    },
});

export default cartSlice.reducer;
