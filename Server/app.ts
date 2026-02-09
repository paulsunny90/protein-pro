import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import mainRoutes from "./routes/index.routes"
import orderRoutes from "./routes/order.routes"

dotenv.config()

const app = express()

app.use(cookieParser());

// Enable CORS for all routes
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"], // Vite's ports
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Use all routes under /api
app.use("/api", mainRoutes);
app.use("/api/orders", orderRoutes);

export default app;
