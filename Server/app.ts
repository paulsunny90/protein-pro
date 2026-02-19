import dotenv from "dotenv"
dotenv.config()
import express from "express"
import cors from "cors"
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const cookieParser = require("cookie-parser");
import mainRoutes from "./routes/index.routes"
import orderRoutes from "./routes/order.routes"
import chatRoutes from "./routes/chat.routes"
const app = express()
app.use(cookieParser());

// Enable CORS for all routes
app.use(cors({
  origin: [process.env.CLIENT_URL || "http://localhost:5173","https://paulsunny90-protein-pro-uipro-ta6i.vercel.app"], // Vite's ports
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Use all routes under /api
import userRoutes from "./routes/user.routes";
app.use("/api", chatRoutes);
app.use("/api", mainRoutes);
app.use("/api/user", userRoutes);
app.use("/api/orders", orderRoutes);

app.get("/api/config/paypal", (req, res) => {
  res.send(process.env.PAYPAL_CLIENT_ID || "sb");
});

// Auth routes (separate from /api to match callback URL)
import passport from "passport";
import "./config/google.config";
import authRoutes from "./routes/auth.routes";

app.use(passport.initialize());
app.use("/auth", authRoutes);

export default app;
