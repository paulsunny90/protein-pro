// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import ProductModel from "./models/product.model.ts";

// dotenv.config();

// async function fetchAll() {
//     try {
//         console.log("Connecting to MongoDB...");
//         await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/protein_db");
//         console.log("Connected successfully.");

//         const products = await ProductModel.find({});
//         console.log(`\nFound ${products.length} products in database:`);

//         products.forEach((p, i) => {
//             console.log(`${i + 1}. [${p.isActive ? 'ACTIVE' : 'INACTIVE'}] ${p.name} - $${p.price} (Category: ${p.category})`);
//         });

//         await mongoose.disconnect();
//         console.log("\nDisconnected from MongoDB.");
//     } catch (err) {
//         console.error("Error fetching products:", err);
//         process.exit(1);
//     }
// }

// fetchAll();
