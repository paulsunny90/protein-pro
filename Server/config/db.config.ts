import mongoose from "mongoose"

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        console.error("FATAL ERROR: MONGO_URI environment variable is not defined.");
        console.log("Please set MONGO_URI in your Render environment variables.");
        process.exit(1);
    }

    try {
        // Log a masked version of the URI to verify it's being read
        const maskedUri = mongoUri.replace(/\/\/.*@/, "//****:****@").split('?')[0];
        console.log(`Connecting to MongoDB at: ${maskedUri}...`);

        await mongoose.connect(mongoUri);
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
}

export default connectDB