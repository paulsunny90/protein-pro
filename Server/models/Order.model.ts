import mongoose, { Schema } from "mongoose";
import { Order } from "../types/adminside.type";

// ORDER ITEM SCHEMA
const orderItemSchema = new Schema(
  {
    product: {
      // type: Schema.Types.ObjectId,
      type: String,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

//ORDER SCHEMA 
const orderSchema = new Schema<Order>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "Userdata",
      required: true,
    },

    orderItems: {
      type: [orderItemSchema],
      required: true,
    },

    shippingAddress: {
      
      type: Schema.Types.Mixed,
      ref: "Address", 
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      required: true,
    },

    itemsPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    shippingPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: {
      type: Date,
    },

    orderStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },

    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);
//MODEL
const OrderModel = mongoose.model<Order>("Order", orderSchema);

export default OrderModel;
