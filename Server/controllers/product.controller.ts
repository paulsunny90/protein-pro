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
        if (req.file) {
            // FormData request
            Productdata = JSON.parse(req.body.data);
            Productdata.imageUrl = `/uploads/${req.file.filename}`;
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

export const getroductController = async (_req: Request, res: Response) => {
    try {
        const Product = await getAllProducts();

        return res.status(200).json({
            success: true,
            message: "Product get successfully",
            data: Product,

        })

    } catch (error: any) {
        return res.status(500).json({
            success: true,
            message: "Product get Failed",
            error: error.message,

        })

    }

}

export const editProductController = async (req: Request<{ id: string }, {}, Partial<Productinput>>, res: Response) => {


    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedProduct = await editProduct(id, updateData);

        return res.status(200).json({
            success: true,
            message: "Product updated  successfully",
            data: updateData

        })


    } catch (error: any) {
        return res.status(500).json({
            success: true,
            message: "Product updated  Failed",
            error: error.message

        })

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