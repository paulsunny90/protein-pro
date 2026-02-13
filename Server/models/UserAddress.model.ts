import mongoose, { Schema } from "mongoose";
import { UserAddress } from "../types/adminside.type";

const addressSchema = new Schema<UserAddress>({

    user: {
        type: Schema.Types.ObjectId,
        ref: "Userdata",
        required: true,
    },

    firstName: {
        type: String,
        required: [true, "First name is required"],
        minLength: [2, "First name must be at least 2 characters"],
        maxLength: [30, "First name must be at most 30 characters"],
        trim: true,

    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        minLength: [2, "Last name must be at least 2 characters"],
        maxLength: [30, "Last name must be at most 30 characters"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email address"],
    },
    houseNoOrName: {
        type: String,
        required: false,
        maxLength: [30, "House number or name must be at most 30 characters"],
        trim: true

    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        match: [/^[0-9]{10}/, "Phone number must be 10 digits"],
        trim: true
    },
    street: {
        type: String,
        required: [true, "street must be required"],
        trim: true

    },
    city: {
        type: String,
        required: [true, "city must be required"],
        trim: true

    },
    state: {
        type: String,
        required: [true, "state must be required"],
        trim: true

    },
    postalCode: {
        type: String,
        required: [true, "postalCode must be required"],
        maxLength: [6, " postalCode must be 6 digits"],
        minLength: [2, " postalCode must be 2 digits"],
        trim: true

    },
    country: {
        type: String,
        required: [true, "country must be required"],
        trim: true

    },
    isDefault: {
        type: Boolean,
        default: false

    },


}, {
    timestamps: true
}
)

const AddressModel = mongoose.model<UserAddress>("Address", addressSchema);

export default AddressModel;