import express from "express";
import { upload } from "../config/upload.config";
import {
    createProductController,
    getProductController,
    editProductController,
    deleteProductController


} from "../controllers/product.controller";

const router = express.Router();

router.post("/", upload.array("images", 5), createProductController);
router.get("/", getProductController)
router.put("/:id", upload.array("images", 5), editProductController)
router.delete("/:id", deleteProductController)


export default router;
