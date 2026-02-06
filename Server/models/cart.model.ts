import mongoose, { Schema, Types } from "mongoose";

interface CartItem {
  product: Types.ObjectId;
  quantity: number;
}

const cartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "Userdata",
      required: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

const CartModel = mongoose.model("Cart", cartSchema);
export default CartModel;
