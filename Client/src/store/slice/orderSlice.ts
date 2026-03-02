import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { formatImageUrl } from '../../utils/imageUtils';

// Helper to format order items with processed images
const formatOrders = (orders: any | any[]) => {
    const processOrder = (order: any) => ({
        ...order,
        items: (order.orderItems || order.items || []).map((item: any) => ({
            ...item,
            product: item.product ? {
                ...item.product,
                image: formatImageUrl(
                    item.product.images?.[0] || item.product.imageUrl || item.product.image
                )
            } : item.product
        })),
        totalAmount: order.totalPrice || order.totalAmount,
        status: order.orderStatus || order.status
    });

    return Array.isArray(orders) ? orders.map(processOrder) : processOrder(orders);
};

// Types
export interface Order {
    _id?: string;
    user?: string;
    items: Array<{
        product: any;
        quantity: number;
        size: string;
        price: number;
    }>;
    shippingAddress: any;
    paymentMethod: string;
    totalAmount: number;
    status: string;
    createdAt?: string;
}

interface OrderState {
    orders: Order[];
    currentOrder: Order | null;
    loading: boolean;
    error: string | null;
}

const initialState: OrderState = {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
};

// Async Thunks

// Create Order
export const createOrder = createAsyncThunk(
    'order/createOrder',
    async (orderData: any, { rejectWithValue }) => {
        try {
            const response = await api.post('/orders', orderData);
            return formatOrders(response.data);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create order');
        }
    }
);

// Get User Orders
export const fetchOrders = createAsyncThunk(
    'order/fetchOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/orders/myorders');
            return formatOrders(response.data);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
        }
    }
);

// Get All Orders (Admin)
export const fetchAllOrders = createAsyncThunk(
    'order/fetchAllOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/orders');
            return formatOrders(response.data);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
        }
    }
);

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        clearCurrentOrder: (state) => {
            state.currentOrder = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create
            .addCase(createOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.currentOrder = action.payload;
                state.orders.push(action.payload);
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Fetch All Orders (Admin)
            .addCase(fetchAllOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Fetch My Orders
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
