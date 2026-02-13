import api from '../utils/api';

export interface Address {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    houseNoOrName?: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface AddressResponse {
    success: boolean;
    message?: string;
    address?: Address;
    addresses?: Address[];
    count?: number;
    errors?: string[];
}

/**
 * Get all addresses for the authenticated user
 */
export const getAllAddresses = async (): Promise<Address[]> => {
    try {
        const response = await api.get<AddressResponse>('/addresses');
        return response.data.addresses || [];
    } catch (error: any) {
        console.error('Error fetching addresses:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch addresses');
    }
};

/**
 * Get a specific address by ID
 */
export const getAddressById = async (id: string): Promise<Address> => {
    try {
        const response = await api.get<AddressResponse>(`/addresses/${id}`);
        if (!response.data.address) {
            throw new Error('Address not found');
        }
        return response.data.address;
    } catch (error: any) {
        console.error('Error fetching address:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch address');
    }
};

/**
 * Get the default address
 */
export const getDefaultAddress = async (): Promise<Address | null> => {
    try {
        const response = await api.get<AddressResponse>('/addresses/default');
        return response.data.address || null;
    } catch (error: any) {
        if (error.response?.status === 404) {
            return null;
        }
        console.error('Error fetching default address:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch default address');
    }
};

/**
 * Create a new address
 */
export const createAddress = async (addressData: Partial<Address>): Promise<Address> => {
    try {
        const response = await api.post<AddressResponse>('/addresses', addressData);
        if (!response.data.address) {
            throw new Error('Failed to create address');
        }
        return response.data.address;
    } catch (error: any) {
        console.error('Error creating address:', error);
        throw new Error(error.response?.data?.message || 'Failed to create address');
    }
};

/**
 * Update an existing address
 */
export const updateAddress = async (id: string, addressData: Partial<Address>): Promise<Address> => {
    try {
        const response = await api.put<AddressResponse>(`/addresses/${id}`, addressData);
        if (!response.data.address) {
            throw new Error('Failed to update address');
        }
        return response.data.address;
    } catch (error: any) {
        console.error('Error updating address:', error);
        throw new Error(error.response?.data?.message || 'Failed to update address');
    }
};

/**
 * Delete an address
 */
export const deleteAddress = async (id: string): Promise<void> => {
    try {
        await api.delete(`/addresses/${id}`);
    } catch (error: any) {
        console.error('Error deleting address:', error);
        throw new Error(error.response?.data?.message || 'Failed to delete address');
    }
};

/**
 * Set an address as default
 */
export const setDefaultAddress = async (id: string): Promise<Address> => {
    try {
        const response = await api.patch<AddressResponse>(`/addresses/${id}/set-default`);
        if (!response.data.address) {
            throw new Error('Failed to set default address');
        }
        return response.data.address;
    } catch (error: any) {
        console.error('Error setting default address:', error);
        throw new Error(error.response?.data?.message || 'Failed to set default address');
    }
};
