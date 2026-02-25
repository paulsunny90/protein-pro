import express from "express";
import { upload } from "../config/upload.config";
import {
    createProductController,
    getProductController,
    editProductController,
    deleteProductController,
    getProductByIdController,
    createProductReview
} from "../controllers/product.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/:id", getProductByIdController);

router.post("/", upload.array("images", 5), createProductController);
router.get("/", getProductController)
router.put("/:id", upload.array("images", 5), editProductController)
router.delete("/:id", deleteProductController)
router.post("/:id/reviews", authMiddleware, createProductReview)


export default router;
