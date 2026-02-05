import express from "express";
import { upload } from "../config/upload.config";
import { 
    createProductController,
    getroductController,
    editProductController,
    deleteProductController 
    

 } from "../controllers/product.controller";

const router = express.Router();

router.post("/product/", upload.single("image"), createProductController);
router.get("/product/", getroductController)
router.put("/product/:id", upload.single("image"), editProductController)
router.delete("/product/:id", deleteProductController)


export default router;
