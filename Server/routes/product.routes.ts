import express from "express";
import { upload } from "../config/upload.config";
import {
    createProductController,
    getProductController,
    editProductController,
    deleteProductController


} from "../controllers/product.controller";

const router = express.Router();

router.post("/", upload.single("image"), createProductController);
router.get("/", getProductController)
router.put("/:id", upload.single("image"), editProductController)
router.delete("/:id", deleteProductController)


export default router;
