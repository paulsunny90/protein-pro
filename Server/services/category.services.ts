import CategoryModel from "../models/category.model";

//create

export const createCategoryService = async (data: {
    name: string;
    slug: string;
    description?: string;
    image?: string;
    isActive?: boolean;
}) => {
    const { name, slug, description, image, isActive } = data;

    const existing = await CategoryModel.findOne({ $or: [{ name }, { slug }] });
    if (existing) {
        throw new Error("CATEGORY_EXISTS");
    }

    const category = new CategoryModel({
        name,
        slug,
        description,
        image,
        isActive: isActive ?? true
    });
    return await category.save();
};


//get all

export const getCategoriesService = async () => {
    return await CategoryModel.find();
};

//get by id

export const getCategoryByIdService = async (id: String) => {
    const category = await CategoryModel.findById(id);

    if (!category) {
        throw new Error("category not found")
    }
    return category;
}

//update

export const updateCategoryService = async (
    id: string,
    data: {
        name?: string;
        slug?: string;
        description?: string;
        image?: string;
        isActive?: boolean;
        parent?: string;
    }
) => {
    const category = await CategoryModel.findById(id);
    if (!category) {
        throw new Error("CATEGORY_NOT_FOUND");
    }

    if (data.name) category.name = data.name;
    if (data.slug) category.slug = data.slug;
    if (data.description !== undefined) category.description = data.description;
    if (data.image !== undefined) category.image = data.image;
    if (data.isActive !== undefined) category.isActive = data.isActive;

    return await category.save();
};

//delete

export const deleteCategoryService = async (id: string) => {
    const category = await CategoryModel.findByIdAndDelete(id);
    if (!category) {
        throw new Error("CATEGORY_NOT_FOUND");
    }
    return true;
};