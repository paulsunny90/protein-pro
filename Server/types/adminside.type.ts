import { Document, Types } from "mongoose"

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        _id?: string;
        name: string;
        email: string;
        role: string;
        [key: string]: any;
      }
    }
  }
}

export interface Review {
  user: Types.ObjectId;
  name: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Product extends Document {
  name: string;
  description: string;
  brand: string;
  category: string;
  targetGroup: 'Mens' | 'Women' | 'Babys' | 'All';
  productType: 'Foods' | 'Supplements';
  price: number;
  imageUrl?: string;
  images?: string[];
  isActive: boolean;
  stock?: number;
  sizes?: string[];
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  reviews: Review[];
  rating: number;
  numReviews: number;
}

export interface Productinput {
  name: string;
  description: string;
  brand: string;
  category: string;
  targetGroup: 'Mens' | 'Women' | 'Babys' | 'All';
  productType: 'Foods' | 'Supplements';
  price: number;
  imageUrl?: string;
  images?: string[];
  isActive?: boolean;
  stock?: number;
  sizes?: string[];
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
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
  paymentResult?: {
    id: string;
    status: string;
    update_time: string;
    email_address: string;
  };
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
  plan: "none" | "silver" | "gold" | "platinum";
  otp?: string;
  otpExpires?: Date;
}

export interface UserAddress extends Document {
  user: Types.ObjectId;
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
}

export interface IWishlistItem {
  product: Types.ObjectId;
  quantity: number;
}

export interface IWishlist extends Document {
  user: Types.ObjectId;
  products: IWishlistItem[];
}
