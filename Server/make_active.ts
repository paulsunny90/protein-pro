// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import ProductModel from "./models/product.model.ts";

// dotenv.config();

// async function makeProductsActive() {
//     try {
//         console.log("Connecting to MongoDB...");
//         await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/protein_db");
//         console.log("Connected successfully.");

//         const result = await ProductModel.updateMany({}, { $set: { isActive: true } });
//         console.log(`\nUpdated ${result.modifiedCount} products to ACTIVE.`);

//         await mongoose.disconnect();
//         console.log("Disconnected from MongoDB.");
//     } catch (err) {
//         console.error("Error updating products:", err);
//         process.exit(1);
//     }
// }

// makeProductsActive();
