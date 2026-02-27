import express from "express";
import multer from 'multer';
import { storage } from "../config/cloudinary.config";
import { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } from "../controllers/category.controller";


import { authMiddleware } from "../middleware/auth.middleware";
import { adminMiddleware } from "../middleware/admin.middleware";

const router = express.Router();
const upload = multer({ storage: storage });

router.get('/', getCategories);
router.get('/:id', getCategoryById);

router.post('/create', authMiddleware, adminMiddleware, upload.single('image'), createCategory);
router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), updateCategory);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCategory);

export default router;