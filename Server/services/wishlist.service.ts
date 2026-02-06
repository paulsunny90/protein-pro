import Wishlist from "../models/Wishlist.models";
import { Types } from "mongoose";

export const addProductToWishlist = async (userId: Types.ObjectId, productId: Types.ObjectId) => {
    let wishlist = await Wishlist.findOne({ user: userId })

    if (!wishlist) {
        wishlist = await Wishlist.create({
            user: userId,
            products: [{ product: productId, quantity: 1 }]

        })
        return wishlist;
    }

    const exists = wishlist.products.find((item: any) => item.product.toString() === productId.toString())
    if (!exists) {
        wishlist.products.push({
            product: productId,
            quantity: 1,

        });
        await wishlist.save();
    }
    return wishlist;
};
export const getWishlistByUser = async (userId: Types.ObjectId) => {
    return await Wishlist.findOne({ user: userId }).populate("products.product");
};

export const removeProductFromWishlist = async (userId: Types.ObjectId, productId: Types.ObjectId) => {
    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
        throw new Error("Wishlist not found");
    }

    wishlist.products = wishlist.products.filter(
        (item: any) => item.product.toString() !== productId.toString()
    );

    await wishlist.save();
    return wishlist;
};


