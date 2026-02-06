import express from "express";
import { createCategory,getCategories,getCategoryById,updateCategory,deleteCategory } from "../controllers/category.controller";


import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";

const router= express.Router();

router.get('/',getCategories);
router.get('/:id',getCategoryById);

router.post('/create', authMiddleware,adminMiddleware,createCategory);
router.put('/:id', authMiddleware,adminMiddleware,updateCategory);
router.delete('/:id',authMiddleware,adminMiddleware,deleteCategory);

export default router