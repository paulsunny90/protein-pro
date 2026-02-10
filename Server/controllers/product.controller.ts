import { Request, Response } from "express";
import {
    createProduct,
    getAllProducts,
    editProduct,
    deleteProduct
} from "../services/product.services";
import { Productinput } from "../types/adminside.type";

export const createProductController = async (req: Request, res: Response) => {
    try {
        let Productdata: Productinput;

        // Handle both JSON and FormData
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            // FormData request with multiple files
            Productdata = JSON.parse(req.body.data);
            Productdata.images = req.files.map(file => `/uploads/${file.filename}`);
            // Set the first image as primary imageUrl for backward compatibility
            Productdata.imageUrl = Productdata.images[0];
        } else {
            // JSON request
            Productdata = req.body;
        }

        const Product = await createProduct(Productdata);
        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: Product,
        });

    } catch (error: any) {
        console.error("Create Product Error:", error);

        // Handle Mongoose validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((err: any) => err.message);
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                error: messages.join('. ')
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to create Product",
            error: error.message,
        });

    }

}

export const getProductController = async (req: Request, res: Response) => {
    try {
        const includeInactive = req.query.all === "true";
        const products = await getAllProducts(includeInactive);

        return res.status(200).json({
            success: true,
            message: "Products retrieved successfully",
            data: products,
        })

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve products",
            error: error.message,
        })

    }

}

export const editProductController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        let updateData: Partial<Productinput>;

        // Handle both JSON and FormData
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            // FormData request with new files
            updateData = JSON.parse(req.body.data);
            const newImages = req.files.map(file => `/uploads/${file.filename}`);

            // Preserve existing images if specified in the request
            const existingImages = updateData.images || [];
            updateData.images = [...existingImages, ...newImages];

            // Set the first image as primary imageUrl for backward compatibility
            if (updateData.images.length > 0) {
                updateData.imageUrl = updateData.images[0];
            }
        } else if (req.body.data && typeof req.body.data === 'string') {
            // FormData request without file (frontend sends JSON string in 'data')
            updateData = JSON.parse(req.body.data);
        } else {
            // Regular JSON request
            updateData = req.body;
        }

        const updatedProduct = await editProduct(id, updateData);

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: updatedProduct
        });

    } catch (error: any) {
        console.error("Edit Product Error:", error);
        return res.status(500).json({
            success: false,
            message: "Product update Failed",
            error: error.message
        });
    }
}

export const deleteProductController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const deletedProduct = await deleteProduct(id);

        if (!deletedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            data: deletedProduct
        });
    } catch (error: any) {
        console.error("Delete Product Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete product",
            error: error.message
        });
    }
}