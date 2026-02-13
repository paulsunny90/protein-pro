import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface OrderItem {
    product: string;
    name: string;
    quantity: number;
    price: number;
    image?: string;
}

export interface ShippingAddress {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
}

export interface Order {
    _id: string;
    user: {
        _id: string;
        name: string;
        email: string;
    };
    orderItems: OrderItem[];
    shippingAddress: ShippingAddress;
    paymentMethod: string;
    itemsPrice: number;
    shippingPrice: number;
    totalPrice: number;
    isPaid: boolean;
    paidAt?: string;
    isDelivered: boolean;
    deliveredAt?: string;
    orderStatus: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    createdAt: string;
    updatedAt: string;
}

// Get all orders (Admin only)
export const getAllOrders = async (): Promise<Order[]> => {
    const response = await api.get('/orders');
    return response.data;
};

// Get order by ID
export const getOrderById = async (orderId: string): Promise<Order> => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
};

// Create new order
export const createOrder = async (orderData: {
    orderItems: OrderItem[];
    shippingAddress: ShippingAddress;
    itemsPrice: number;
    shippingPrice: number;
    totalPrice: number;
}): Promise<Order> => {
    const response = await api.post('/orders', orderData);
    return response.data;
};

export default {
    getAllOrders,
    getOrderById,
    createOrder,
};
