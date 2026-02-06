import { Request, Response } from "express";
import { Types } from "mongoose";
import {
  addProductToWishlist,
  getWishlistByUser,
  removeProductFromWishlist,
} from "../services/wishlist.service";

export const addToWishlist = async (req: Request, res: Response) => {
  try {
    // 🔥 THIS IS THE KEY FIX
    const userId = req.user?.id;
    const { productId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    const wishlist = await addProductToWishlist(
      new Types.ObjectId(userId),
      new Types.ObjectId(productId)
    );

    res.status(200).json(wishlist);
  } catch (error) {
    console.error("ADD WISHLIST ERROR:", error);
    res.status(500).json({ message: "Failed to add to wishlist" });
  }
};

export const getWishlist = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const wishlist = await getWishlistByUser(
      new Types.ObjectId(userId)
    );

    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch wishlist" });
  }
};

export const removeFromWishlist = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const { productId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const wishlist = await removeProductFromWishlist(
      new Types.ObjectId(userId),
      new Types.ObjectId(productId)
    );

    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ message: "Failed to remove product" });
  }
};
