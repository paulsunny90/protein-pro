import mongoose,{Schema, Types, Document, Model} from "mongoose";
import { IWishlist,IWishlistItem } from "../types/adminside.type";
const wishlistItemSchema = new Schema<IWishlistItem>(
    {
        product:{
            type:Schema.Types.ObjectId,
            ref:"Product",
            required: true,

        },
        quantity: { 
             type: Number,
            default: 1,
             min: 1,
        },

    },
    { _id: false }
);

const wishlistSchema = new Schema<IWishlist>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "Userdata",
      required: true,
      unique: true, 
    },
    products: [wishlistItemSchema],
  },
  { timestamps: true }
);

const WishlisModel :Model <IWishlist>=mongoose.model<IWishlist>(
     "Wishlist",
     wishlistSchema
)
export default WishlisModel;