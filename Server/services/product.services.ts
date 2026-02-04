import mongoose from "mongoose";
import ProductModel from "../models/product.model";
import { Productinput } from "../types/adminside.type";

 export const createProduct =async(data:Productinput)=>{
     console.log("SERVICE DATA:", data); // debug

    return await ProductModel.create(data)
}

export const getAllProducts = async() => {
    return await ProductModel.find({ isActive: true });
}

export const editProduct = async (id:string,data:Partial<Productinput>)=>{
    if (!mongoose.Types.ObjectId.isValid(id))return null;

    return await ProductModel.findByIdAndUpdate(id,
        {...data,updatedAt:new Date()},
        {new:true, runValidators:true}
    );

}

export const deleteProduct =async (id:string)=>{
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return await ProductModel.findByIdAndDelete(id)
}

export const deleteProductSoft =async (id:string)=>{
    if (!mongoose.Types.ObjectId.isValid(id)) return null;
    return await ProductModel.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
    );
}

