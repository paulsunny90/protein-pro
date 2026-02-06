import Cart from "../models/cart.model";
import { Types } from "mongoose";

interface CartItem {
  product: Types.ObjectId;
  quantity: number;
}

export const getCart = async (userId: string) => {
  return Cart.findOne({ user: userId }).populate("items.product");
};

export const addToCart = async (userId: string, productId: string, quantity = 1) => {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    return Cart.create({
      user: userId,
      items: [{ product: productId, quantity }],
    });
  }

  const item = cart.items.find(
    (i: CartItem) => i.product.toString() === productId
  );

  if (item) {
    item.quantity += quantity;
  } else {
    cart.items.push({ product: new Types.ObjectId(productId), quantity });
  }

  await cart.save();
  return cart;
};

export const updateCartItem = async (userId: string, productId: string, quantity: number) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new Error("Cart not found");

  const item = cart.items.find((i: CartItem) => i.product.toString() === productId);
  if (!item) throw new Error("Item not found");

  item.quantity = quantity;
  await cart.save();
  return cart;
};

export const removeFromCart = async (userId: string, productId: string) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new Error("Cart not found");

  cart.items = cart.items.filter(
    (i: CartItem) => i.product.toString() !== productId
  ) as any;

  await cart.save();
  return cart;
};
