import express from "express"
import dotenv from  "dotenv"
import cors from "cors"
import productRoutes from "./routes/product.routes"

dotenv .config()

const app = express()

// Enable CORS for all routes
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"], // Vite's ports
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api", productRoutes)

export default app;
