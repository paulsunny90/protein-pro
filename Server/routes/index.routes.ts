import express from "express";
import categoryRoutes from "./Category.routes";
// import subCategoryRoutes from "./category/SubCategory.routes.js";
import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import cartRoutes from "./cart.routes";
import productRoutes from "./product.routes";

import wishlistRoutes from "./wishlist.routes";

import uploadRoutes from "./upload.routes";

const router = Router();

router.use('/category', categoryRoutes);
// router.use('/subcategory', subCategoryRoutes);
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/cart", cartRoutes);
router.use("/products", productRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/upload", uploadRoutes);


export default router; 
