import mongoose from "mongoose"

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        console.error("❌ FATAL ERROR: MONGO_URI is not defined.");
        console.log("👉 ACTION REQUIRED: Add MONGO_URI to your Render Environment Variables.");
        process.exit(1);
    }

    if (mongoUri.includes("localhost") && process.env.NODE_ENV === "production") {
        console.warn("⚠️  WARNING: Using localhost MongoDB URI in a production environment.");
        console.log("Check if you accidentally included a .env file in your git repo or forgot to set the MONGO_URI on Render.");
    }

    try {
        const maskedUri = mongoUri.replace(/\/\/.*@/, "//****:****@").split('?')[0];
        console.log(`📡 Connecting to MongoDB: ${maskedUri}`);

        await mongoose.connect(mongoUri);
        console.log("✅ Connected to MongoDB successfully");
    } catch (error) {
        console.error("❌ MongoDB connection failed:", error);
        console.log("👉 Tip: If you are using MongoDB Atlas, make sure you have allowed access from all IP addresses (0.0.0.0/0) in the Atlas Network Security tab.");
        process.exit(1);
    }
}

export default connectDB