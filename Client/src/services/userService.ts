import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface User {
    _id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    role: 'user' | 'admin';
    authProvider: 'local' | 'google';
    isVerified: boolean;
    plan: 'none' | 'silver' | 'gold' | 'platinum';
    createdAt: string;
    updatedAt: string;
}

// Get all users (Admin only)
export const getAllUsers = async (): Promise<User[]> => {
    const response = await api.get('/user/all');
    return response.data;
};

// Get user profile
export const getUserProfile = async (): Promise<User> => {
    const response = await api.get('/user/profile');
    return response.data.user;
};

export default {
    getAllUsers,
    getUserProfile,
};
