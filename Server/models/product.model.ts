import mongoose, { Schema, Model } from "mongoose";
import { Product } from "../types/adminside.type";

const ProductSchema: Schema<Product> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
    },
    targetGroup: {
      type: String,
      enum: ['Mens', 'Women', 'Babys', 'All'],
      default: 'All',
    },
    productType: {
      type: String,
      enum: ['Foods', 'Supplements'],
      required: true,
      default: 'Supplements',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    images: {
      type: [String],
      default: []
    },
    stock: {
      type: Number,
      default: 0,
      min: 0
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    sizes: [{
      type: String,
      enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    }],
    calories: {
      type: Number,
      default: 0
    },
    protein: {
      type: Number,
      default: 0
    },
    carbs: {
      type: Number,
      default: 0
    },
    fat: {
      type: Number,
      default: 0
    },
    fiber: {
      type: Number,
      default: 0
    },
    reviews: [
      new Schema(
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Userdata",
          },
          name: { type: String, required: true },
          rating: { type: Number, required: true },
          comment: { type: String, required: true },
        },
        { timestamps: true }
      ),
    ],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

const ProductModel: Model<Product> =
  mongoose.models.Product || mongoose.model<Product>("Product", ProductSchema);

export default ProductModel;
