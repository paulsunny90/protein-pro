import { Request, Response } from "express";
import * as addressService from "../services/address.service";

/**
 * Get all addresses 
 */
export const getUserAddresses = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const addresses = await addressService.getAllUserAddresses(userId);

        res.status(200).json({
            success: true,
            count: addresses.length,
            addresses
        });
    } catch (error: any) {
        console.error("GET USER ADDRESSES ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch addresses"
        });
    }
};

/**
 * Get a single address 
 */
export const getAddressById = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const addressId = req.params.id as string;

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const address = await addressService.getAddressById(userId, addressId);

        if (!address) {
            return res.status(404).json({ message: "Address not found" });
        }

        res.status(200).json({
            success: true,
            address
        });
    } catch (error: any) {
        console.error("GET ADDRESS BY ID ERROR:", error);
        res.status(error.message === "Invalid address ID" ? 400 : 500).json({
            success: false,
            message: error.message || "Failed to fetch address"
        });
    }
};

/**
 * Create a new address
 */
export const createAddress = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            console.warn("CREATE ADDRESS: No userId found in request");
            return res.status(401).json({ message: "User not authenticated" });
        }

        console.log("CREATE ADDRESS REQUEST BODY:", req.body);

        const {
            name,
            firstName,
            lastName,
            email,
            houseNoOrName,
            phone,
            street,
            city,
            state,
            zipCode,
            postalCode,
            country,
            isDefault
        } = req.body;

        // Handle field mapping 
        const finalPostalCode = postalCode || zipCode;

        // Handle name splitting if Full Name is provided instead of first/last name
        let finalFirstName = firstName;
        let finalLastName = lastName;

        if (name && (!firstName || !lastName)) {
            const parts = name.trim().split(/\s+/);
            finalFirstName = parts[0];
            finalLastName = parts.slice(1).join(' ') || '.';
        }

        // Basic validation before passing to service
        if (!finalFirstName || !finalLastName || !email || !phone || !street || !city || !state || !finalPostalCode || !country) {
            return res.status(400).json({
                message: "Missing required fields. Please provide first name, last name, email, phone, street, city, state, postal code, and country.",
                details: {
                    firstName: !!finalFirstName,
                    lastName: !!finalLastName,
                    email: !!email,
                    phone: !!phone,
                    street: !!street,
                    city: !!city,
                    state: !!state,
                    postalCode: !!finalPostalCode,
                    country: !!country
                }
            });
        }

        const newAddress = await addressService.createAddress(userId, {
            firstName: finalFirstName,
            lastName: finalLastName,
            email,
            houseNoOrName,
            phone,
            street,
            city,
            state,
            postalCode: finalPostalCode,
            country,
            isDefault
        });

        res.status(201).json({
            success: true,
            message: "Address created successfully",
            address: newAddress
        });
    } catch (error: any) {
        console.error("CREATE ADDRESS ERROR:", error);

        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map((err: any) => err.message);
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors
            });
        }

        res.status(500).json({
            success: false,
            message: error.message || "Failed to create address"
        });
    }
};


export const updateAddress = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const addressId = req.params.id as string;

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const {
            name,
            firstName,
            lastName,
            houseNoOrName,
            phone,
            street,
            city,
            state,
            zipCode,
            postalCode,
            country,
            isDefault
        } = req.body;

        const finalPostalCode = postalCode || zipCode;

        let finalFirstName = firstName;
        let finalLastName = lastName;

        if (name && (!firstName || !lastName)) {
            const parts = name.trim().split(/\s+/);
            finalFirstName = parts[0];
            finalLastName = parts.slice(1).join(' ') || '.';
        }

        const updatedAddress = await addressService.updateAddress(userId, addressId, {
            firstName: finalFirstName,
            lastName: finalLastName,
            houseNoOrName,
            phone,
            street,
            city,
            state,
            postalCode: finalPostalCode,
            country,
            isDefault
        });

        res.status(200).json({
            success: true,
            message: "Address updated successfully",
            address: updatedAddress
        });
    } catch (error: any) {
        console.error("UPDATE ADDRESS ERROR:", error);

        if (error.message === "Address not found") {
            return res.status(404).json({ message: error.message });
        }

        if (error.message === "Invalid address ID") {
            return res.status(400).json({ message: error.message });
        }

        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map((err: any) => err.message);
            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors
            });
        }

        res.status(500).json({
            success: false,
            message: error.message || "Failed to update address"
        });
    }
};

/**
 * Delete an address
 */
export const deleteAddress = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const addressId = req.params.id as string;

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        await addressService.deleteAddress(userId, addressId);

        res.status(200).json({
            success: true,
            message: "Address deleted successfully"
        });
    } catch (error: any) {
        console.error("DELETE ADDRESS ERROR:", error);

        if (error.message === "Address not found") {
            return res.status(404).json({ message: error.message });
        }

        if (error.message === "Invalid address ID") {
            return res.status(400).json({ message: error.message });
        }

        res.status(500).json({
            success: false,
            message: error.message || "Failed to delete address"
        });
    }
};

/**
 * Set an address as default
 */
export const setDefaultAddress = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        const addressId = req.params.id as string;

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const address = await addressService.setDefaultAddress(userId, addressId);

        res.status(200).json({
            success: true,
            message: "Default address updated successfully",
            address
        });
    } catch (error: any) {
        console.error("SET DEFAULT ADDRESS ERROR:", error);

        if (error.message === "Address not found") {
            return res.status(404).json({ message: error.message });
        }

        if (error.message === "Invalid address ID") {
            return res.status(400).json({ message: error.message });
        }

        res.status(500).json({
            success: false,
            message: error.message || "Failed to set default address"
        });
    }
};

/**
 * Get the default address for the authenticated user
 */
export const getDefaultAddress = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const defaultAddress = await addressService.getDefaultAddress(userId);

        if (!defaultAddress) {
            return res.status(404).json({
                success: false,
                message: "No default address found"
            });
        }

        res.status(200).json({
            success: true,
            address: defaultAddress
        });
    } catch (error: any) {
        console.error("GET DEFAULT ADDRESS ERROR:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch default address"
        });
    }
};
