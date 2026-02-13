import AddressModel from "../models/UserAddress.model";
import { Types } from "mongoose";
import { UserAddress } from "../types/adminside.type";

/**
 * Get all addresses for a user
 */
export const getAllUserAddresses = async (userId: string) => {
    return await AddressModel.find({ user: new Types.ObjectId(userId) }).sort({ isDefault: -1, createdAt: -1 });
};

/**
 * Get a specific address by ID
 */
export const getAddressById = async (userId: string, addressId: string) => {
    if (!Types.ObjectId.isValid(addressId)) {
        throw new Error("Invalid address ID");
    }
    return await AddressModel.findOne({
        _id: addressId,
        user: new Types.ObjectId(userId)
    });
};

/**
 * Create a new address for a user
 */
export const createAddress = async (userId: string, addressData: Partial<UserAddress>) => {
    // If this address is set as default, unset other default addresses
    if (addressData.isDefault) {
        console.log("SETTING DEFAULT ADDRESS: Unsetting others for user", userId);
        await AddressModel.updateMany(
            { user: new Types.ObjectId(userId), isDefault: true },
            { isDefault: false }
        );
    }

    console.log("SAVING ADDRESS TO DB:", { ...addressData, userId });

    return await AddressModel.create({
        ...addressData,
        user: new Types.ObjectId(userId)
    });
};

/**
 * Update an existing address
 */
export const updateAddress = async (userId: string, addressId: string, addressData: Partial<UserAddress>) => {
    if (!Types.ObjectId.isValid(addressId)) {
        throw new Error("Invalid address ID");
    }

    const existingAddress = await AddressModel.findOne({
        _id: addressId,
        user: new Types.ObjectId(userId)
    });

    if (!existingAddress) {
        throw new Error("Address not found");
    }

    // If this address is being set as default, unset other default addresses
    if (addressData.isDefault && !existingAddress.isDefault) {
        await AddressModel.updateMany(
            { user: new Types.ObjectId(userId), isDefault: true, _id: { $ne: addressId } },
            { isDefault: false }
        );
    }

    return await AddressModel.findByIdAndUpdate(
        addressId,
        addressData,
        { new: true, runValidators: true }
    );
};

/**
 * Delete an address
 */
export const deleteAddress = async (userId: string, addressId: string) => {
    if (!Types.ObjectId.isValid(addressId)) {
        throw new Error("Invalid address ID");
    }

    const address = await AddressModel.findOne({
        _id: addressId,
        user: new Types.ObjectId(userId)
    });

    if (!address) {
        throw new Error("Address not found");
    }

    // If deleting the default address, set another address as default
    if (address.isDefault) {
        const otherAddress = await AddressModel.findOne({
            user: new Types.ObjectId(userId),
            _id: { $ne: addressId }
        });

        if (otherAddress) {
            otherAddress.isDefault = true;
            await otherAddress.save();
        }
    }

    return await AddressModel.findByIdAndDelete(addressId);
};

/**
 * Set an address as default
 */
export const setDefaultAddress = async (userId: string, addressId: string) => {
    if (!Types.ObjectId.isValid(addressId)) {
        throw new Error("Invalid address ID");
    }

    const address = await AddressModel.findOne({
        _id: addressId,
        user: new Types.ObjectId(userId)
    });

    if (!address) {
        throw new Error("Address not found");
    }

    // Unset all other default addresses
    await AddressModel.updateMany(
        { user: new Types.ObjectId(userId), isDefault: true },
        { isDefault: false }
    );

    // Set this address as default
    address.isDefault = true;
    return await address.save();
};

/**
 * Get the default address for a user
 */
export const getDefaultAddress = async (userId: string) => {
    return await AddressModel.findOne({
        user: new Types.ObjectId(userId),
        isDefault: true
    });
};
