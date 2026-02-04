import { Request, Response } from "express";
import {
    createProduct,
    getAllProducts,
    editProduct,
    deleteProduct
} from "../services/product.services";
import { Productinput } from "../types/adminside.type";

export const createProductController = async (req: Request<{}, {}, Productinput>, res: Response) => {
    try {
        const Productdata = req.body;
         if (req.file) {
         Productdata.imageUrl = `/uploads/${req.file.filename}`;
    }
        const Product = await createProduct(Productdata)
        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: Product,
        });

    } catch (error: any) {
        console.error("Create Product Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to created Product ",
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
        return res.status(200).json({
            success: true,
            message: "Product delete  successfully",
            data: deletedProduct

        })
    } catch (error: any) {
        return res.status(200).json({
            success: true,
            message: "Product delete  successfully",
            error: error.message

        })

    }

}