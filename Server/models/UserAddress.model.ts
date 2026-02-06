import mongoose,{Schema} from "mongoose";
import { UserAddress } from "../types/adminside.type";

const addressSchema =new Schema<UserAddress>({

    userLogin:{
        type:Schema.Types.ObjectId,
        ref:"userSchema",
        required:true,
    },  

    firstName:{
        type:String,
        required:[true,"First name is required"],
        minLength:[2,"First name must be at least 2 characters"],
        maxLength:[30,"First name must be at least 30 characters"],
        trim: true,

    },
    lastName:{
        type:String,
        required:[true,"First name is required"],
        minLength:[2,"First name must be at least 2 characters"],
        maxLength:[30,"First name must be at least 30 characters"],
        trim: true,
    },

    houseNoOrName:{
        type:String,
         required:[true,"houseNoOrName name is required"],
         maxLength:[30,"First name must be at least 30 characters"],
         trim:true

    },
    phone:{
        type:String,
        required:[true,"phonenumber name is required"],
        match:[/^[0-9]{10}/,"phonenumber must be 10 digits "],
        trim:true
    },
    street:{
        type:String,
        required:[true,"street must be required"],
        trim:true

    },
    city:{
        type:String,
        required:[true,"city must be required"],
        trim:true

    },
    state:{
        type:String,
        required:[true,"state must be required"],
        trim:true

    },
    postalCode:{
        type:String,
        required:[true,"postalCode must be required"],
        maxLength:[6," postalCode must be 6 digits"],
        minLength:[2," postalCode must be 2 digits"],
        trim:true

    },
    country:{
        type:String,
        required:[true,"country must be required"],
        trim:true

    },
    isDefault:{
        type:Boolean,
        default:false

    },
    

},{
    timestamps:true
}
)

const AddressModel =mongoose.model<UserAddress>("Address",addressSchema);