import mongoose, { Schema } from "mongoose";
import { Category } from "../types/adminside.type";

const categorySchema = new Schema<Category>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        description: {
            type: String
        },
        image: {
            type: String
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
)

const CategoryModel = mongoose.model<Category>("Category", categorySchema);
export default CategoryModel;