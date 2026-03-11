import { Request, Response } from "express";
import {
    createProduct,
    getAllProducts,
    editProduct,
    deleteProduct,
    getProductById
} from "../services/product.services";
import { Productinput } from "../types/adminside.type";
import ProductModel from "../models/product.model";

export const createProductController = async (req: Request, res: Response) => {
    try {
        let Productdata: Productinput;

        // Handle both JSON and FormData
        console.log("Create Product Request Received");
        let files: any[] = [];
        if (req.files) {
            if (Array.isArray(req.files)) {
                files = req.files;
            } else if (typeof req.files === 'object') {
                const filesObj = req.files as Record<string, any[]>;
                files = filesObj.images || [];
            }
        }

        if (files.length > 0) {
            // FormData request with multiple files (Cloudinary storage)
            console.log("FILES RECEIVED:", files.map(f => ({ path: f.path, name: f.originalname })));
            Productdata = JSON.parse(req.body.data);
            Productdata.images = files.map((file: any) => file.path.replace(/\\/g, '/'));
            // Set the first image as primary imageUrl for backward compatibility
            Productdata.imageUrl = Productdata.images[0];

        } else if (req.body.data && typeof req.body.data === 'string') {
            // FormData request without file (frontend sends JSON string in 'data')
            Productdata = JSON.parse(req.body.data);
        } else {
            // Regular JSON request
            Productdata = req.body;
        }

        console.log("FINAL PRODUCT DATA TO SAVE:", JSON.stringify(Productdata, null, 2));

        // Ensure images array is populated from imageUrl if no files were uploaded
        if ((!Productdata.images || Productdata.images.length === 0) && Productdata.imageUrl) {
            Productdata.images = [Productdata.imageUrl];
        }
        // Ensure imageUrl is set from images array if not provided
        if (!Productdata.imageUrl && Productdata.images && Productdata.images.length > 0) {
            Productdata.imageUrl = Productdata.images[0];
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


export const getProductByIdController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        const product = await getProductById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product retrieved successfully",
            data: product
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve product",
            error: error.message
        });
    }
}

export const editProductController = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { id } = req.params;
        console.log("Updating product ID:", id);
        let updateData: Partial<Productinput>;

        // Handle both JSON and FormData
        console.log("Edit Product Request Received for ID:", id);
        let files: any[] = [];
        if (req.files) {
            if (Array.isArray(req.files)) {
                files = req.files;
            } else if (typeof req.files === 'object') {
                const filesObj = req.files as Record<string, any[]>;
                files = filesObj.images || [];
            }
        }

        if (files.length > 0) {
            // FormData request with new files (Cloudinary storage)
            updateData = JSON.parse(req.body.data);
            const newImages = files.map((file: any) => file.path.replace(/\\/g, '/'));

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

        console.log("Final updateData:", JSON.stringify(updateData, null, 2));
        if (req.files) {
            console.log("New files uploaded:", (req.files as any[]).length);
        }

        // Ensure images array is populated from imageUrl if not present
        if ((!updateData.images || updateData.images.length === 0) && updateData.imageUrl) {
            updateData.images = [updateData.imageUrl];
        }
        // Ensure imageUrl is set from images array if not provided
        if (!updateData.imageUrl && updateData.images && updateData.images.length > 0) {
            updateData.imageUrl = updateData.images[0];
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

export const createProductReview = async (req: Request, res: Response) => {
    try {
        const { rating, comment } = req.body;

        if (!rating || !comment) {
            return res.status(400).json({
                success: false,
                message: "Rating and comment are required",
            });
        }

        const product = await ProductModel.findById(req.params.id);

        if (product) {
            const userId = req.user?.id || req.user?._id;
            const userName = req.user?.name || "Anonymous";

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "User context missing",
                });
            }

            const alreadyReviewed = product.reviews.find(
                (r: any) => r.user.toString() === userId.toString()
            );

            if (alreadyReviewed) {
                return res.status(400).json({
                    success: false,
                    message: "Product already reviewed",
                });
            }

            const review = {
                name: userName,
                rating: Number(rating),
                comment,
                user: userId,
            };

            product.reviews.push(review as any);
            product.numReviews = product.reviews.length;
            product.rating =
                product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) /
                product.reviews.length;

            await product.save();
            res.status(201).json({
                success: true,
                message: "Review added",
            });
        } else {
            res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: "Failed to add review",
            error: error.message,
        });
    }
};