import mongoose from "mongoose";
import dotenv from "dotenv";
import Userlog from "../../models/user.model.ts";
import bcrypt from "bcryptjs";

dotenv.config();

async function seedAdmin() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/protein_db");
        console.log("Connected successfully.");

        const adminEmail = "admin@purefitness.com";
        const adminPassword = "admin123";

        // Check if admin already exists
        const existingAdmin = await Userlog.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log("Admin user already exists. Updating password...");
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            await Userlog.updateOne({ email: adminEmail }, {
                $set: {
                    password: hashedPassword,
                    role: "admin",
                    isVerified: true
                }
            });
            console.log("Admin password updated to: " + adminPassword);
        } else {
            console.log("Creating new Admin user...");
            const hashedPassword = await bcrypt.hash(adminPassword, 10);

            const admin = new Userlog({
                name: "System Admin",
                email: adminEmail,
                password: hashedPassword,
                role: "admin",
                isVerified: true,
                phoneNumber: "9876543210",
                authProvider: "local",
            });

            await admin.save();
            console.log("Admin user created successfully!");
            console.log("Email: " + adminEmail);
            console.log("Password: " + adminPassword);
        }

        await mongoose.disconnect();
        console.log("Disconnected from MongoDB.");
    } catch (err) {

        
        console.error("Error seeding admin:", err);
        process.exit(1);
    }
}

seedAdmin();
