import api from '../utils/api';

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
