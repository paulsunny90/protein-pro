import mongoose from "mongoose";
import dotenv from "dotenv";
import Userlog from "./models/user.model.ts";

dotenv.config();

async function verifyAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/protein_db");
        const admin = await Userlog.findOne({ email: "admin@purefitness.com" });
        if (admin) {
            console.log("Admin found:");
            console.log("Email:", admin.email);
            console.log("Role:", admin.role);
            console.log("IsVerified:", admin.isVerified);
        } else {
            console.log("Admin NOT found in database.");
        }
        await mongoose.disconnect();
    } catch (err) {
        console.error("Error:", err);
    }
}
verifyAdmin();
