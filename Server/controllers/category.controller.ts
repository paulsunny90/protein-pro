import { Request, Response } from "express";
import {
  createCategoryService,
  getCategoriesService,
  getCategoryByIdService,
  updateCategoryService,
  deleteCategoryService,
} from "../services/category.services";

// CREATE
export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await createCategoryService(req.body);
    res.status(201).json(category);
  } catch (error: any) {
    if (error.message === "CATEGORY_EXISTS") {
      return res.status(400).json({ message: "Category already exists" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL
export const getCategories = async (_req: Request, res: Response) => {
  try {
    const categories = await getCategoriesService();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET BY ID
export const getCategoryById = async (
  req: Request <{ id:string }>,
  res: Response
) => {
  try {
    const category = await getCategoryByIdService(req.params.id);
    res.status(200).json(category);
  } catch (error: any) {
    if (error.message === "CATEGORY_NOT_FOUND") {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE
export const updateCategory = async (
  req: Request <{ id: string}>,
  res: Response
) => {
  try {
    const category = await updateCategoryService(req.params.id, req.body);
    res.status(200).json(category);
  } catch (error: any) {
    if (error.message === "CATEGORY_NOT_FOUND") {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE
export const deleteCategory = async (
  req: Request <{id:string}>,
   res: Response
  ) => {
  try {
    await deleteCategoryService(req.params.id);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error: any) {
    if (error.message === "CATEGORY_NOT_FOUND") {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};
