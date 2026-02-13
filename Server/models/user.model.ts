
import mongoose, { Schema } from "mongoose";
import { UserLogin } from "../types/adminside.type";

const userSchema: Schema<UserLogin> = new Schema(
    {
        name: {
            type: String,
            required: [true, "name is required"],
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email address"],
        },
        phoneNumber: {
            type: String,
            // required: [true,"phonenumber name is required"],
            trim: true,
            match: [/^[0-9]{10}/, "phonenumber must be 10 digits "]
        },
        password: {
            type: String,
            minlength: [6, "Password must be at least 6 characters"],
            select: false // optional but recommended
        },
        role: {
            type: String,
            enum: {
                values: ["user", "admin"],
                message: "Role must be user or admin"
            },
            default: "user"

        },
        authProvider: {
            type: String,
            enum: {
                values: ["local", "google"],
                message: "Auth provider must be local or google"
            },
            default: "local",

        },
        googleID: {
            type: String,
        },

        isVerified: {
            type: Boolean,
            default: false
        },
        plan: {
            type: String,
            enum: {
                values: ["none", "silver", "gold", "platinum"],
                message: "Plan must be none, silver, gold, or platinum"
            },
            default: "none"
        },
        otp: {
            type: String
        },
        otpExpires: {
            type: Date
        }



    }, {
    timestamps: true,
}
)

const Userlog = mongoose.model<UserLogin>("Userdata", userSchema)

export default Userlog;
