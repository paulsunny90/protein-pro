import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from '../../utils/api';
import { formatImageUrl } from "../../utils/imageUtils";

export interface Category {
    _id?: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    isActive: boolean;
}

interface CategoryState {
    categories: Category[];
    loading: boolean;
    error: string | null;
}

const initialState: CategoryState = {
    categories: [],
    loading: false,
    error: null,
};

// GET ALL
export const fetchCategories = createAsyncThunk(
    "category/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/category");
            // res.data is expected to be an array based on category.controller.ts return res.status(200).json(categories);
            const data = Array.isArray(res.data) ? res.data : (res.data.data || []);

            return data.map((cat: any) => ({
                ...cat,
                image: formatImageUrl(cat.image)
            }));
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch categories");
        }
    }
);

// ADD
export const addCategory = createAsyncThunk(
    "category/add",
    async (data: FormData, { rejectWithValue }) => {
        try {
            const res = await api.post("/category/create", data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const cat = res.data;
            return {
                ...cat,
                image: formatImageUrl(cat.image)
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to add category");
        }
    }
);

// UPDATE
export const updateCategory = createAsyncThunk(
    "category/update",
    async ({ id, data }: { id: string; data: FormData }, { rejectWithValue }) => {
        try {
            const res = await api.put(`/category/${id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const cat = res.data;
            return {
                ...cat,
                image: formatImageUrl(cat.image)
            };
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to update category");
        }
    }
);

// DELETE
export const deleteCategory = createAsyncThunk(
    "category/delete",
    async (id: string, { rejectWithValue }) => {
        try {
            await api.delete(`/category/${id}`);
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Failed to delete category");
        }
    }
);

const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(addCategory.fulfilled, (state, action: PayloadAction<Category>) => {
                state.categories.push(action.payload);
            })
            .addCase(updateCategory.fulfilled, (state, action: PayloadAction<Category>) => {
                const index = state.categories.findIndex(c => c._id === action.payload._id);
                if (index !== -1) state.categories[index] = action.payload;
            })
            .addCase(deleteCategory.fulfilled, (state, action: PayloadAction<string>) => {
                state.categories = state.categories.filter(c => c._id !== action.payload);
            });
    },
});

export default categorySlice.reducer;
