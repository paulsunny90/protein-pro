import express from "express";
import { upload } from "../config/upload.config";
import {
    createProductController,
    getProductController,
    editProductController,
    deleteProductController,
    getProductByIdController
} from "../controllers/product.controller";

const router = express.Router();

router.get("/:id", getProductByIdController);

router.post("/", upload.array("images", 5), createProductController);
router.get("/", getProductController)
router.put("/:id", upload.array("images", 5), editProductController)
router.delete("/:id", deleteProductController)


export default router;
