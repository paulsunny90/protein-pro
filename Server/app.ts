import express from "express"
import dotenv from  "dotenv"
import productRoutes from "./routes/product.routes"

dotenv .config()

const app = express()

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api", productRoutes)

export default app;
