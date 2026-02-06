import {Document,Types} from "mongoose"

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        _id?: string;
        email: string;
        role: string;
        [key: string]: any;
      }
    }
  }
}

export interface Product extends Document{
  name: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  imageUrl?: string; 
  isActive: boolean;
  stock?: number;
  sizes?: string[];
}

export interface Productinput{
  name: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  imageUrl?: string; 
  isActive?: boolean;
  stock?: number;
  sizes?: string[];
}

export interface Category extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
}

export interface Order extends Document {
  user: Types.ObjectId;
  orderItems: Array<{
    product: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: any;
  paymentMethod: "COD" | "ONLINE";
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  orderStatus: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";
  deliveredAt?: Date;
}

export interface UserLogin extends Document {
  name: string;
  email: string;
  phoneNumber?: string;
  password?: string;
  role: "user" | "admin";
  authProvider: "local" | "google";
  googleID?: string;
  isVerified: boolean;
}

export interface UserAddress extends Document {
  userLogin: Types.ObjectId;
  firstName: string;
  lastName: string;
  houseNoOrName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface IWishlistItem {
  product: Types.ObjectId;
  quantity: number;
}

export interface IWishlist extends Document {
  user: Types.ObjectId;
  products: IWishlistItem[];
}

