import { createSlice, createAsyncThunk, } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import api from '../../utils/api';
import { formatImageUrl } from "../../utils/imageUtils";

// ✅ axios instance (cleaner)
// const api = axios.create({
//   baseURL: "http://localhost:5000/api/product",
// });


// ==============================
// Types
// ==============================

export interface Product {
  _id?: string;
  id?: string; // Optional id for frontend compatibility
  name: string;
  description: string;
  brand: string;
  category: string;
  targetGroup: 'Mens' | 'Women' | 'Babys' | 'All';
  productType: 'Foods' | 'Supplements';
  price: number;
  originalPrice: number;
  rating: number; // Added
  reviewCount: number; // Added
  image: string; // Changed from imageUrl to image to match component
  imageUrl?: string; // Keep for backward compatibility if needed
  images?: string[]; // Multiple images array
  isActive: boolean;
  inStock: boolean; // Added
  discount: number; // Added
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  stock?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}


// ==============================
// Initial State
// ==============================

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};


// Async Thunks (API calls)
// ==============================

// ✅ GET ALL
export const fetchProducts = createAsyncThunk(
  "product/fetchAll",
  async (includeAll: boolean = false) => {
    const res = await api.get(`/products${includeAll ? '?all=true' : ''}`);

    // Map backend data to frontend structure
    return res.data.data.map((p: any) => ({
      ...p,
      image: formatImageUrl(p.images?.[0] || p.imageUrl), // Use first image from array or fallback to imageUrl
      images: p.images?.map((img: string) => formatImageUrl(img)) || [], // Map all images
      rating: p.rating || 4.5, // Default rating if missing
      reviewCount: p.reviewCount || 0,
      discount: p.discount || 0,
      inStock: p.stock > 0,
      originalPrice: p.originalPrice || p.price
    }));
  }
);

// ✅ GET BY ID
export const fetchProductById = createAsyncThunk(
  "product/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/products/${id}`);
      const p = res.data.data;

      // Format the single product response
      return {
        ...p,
        image: formatImageUrl(p.imageUrl),
        rating: p.rating || 4.5,
        reviewCount: p.reviewCount || 0,
        discount: p.discount || 0,
        inStock: p.stock > 0,
        originalPrice: p.originalPrice || p.price
      };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch product");
    }
  }
);


// ✅ ADD
export const addProduct = createAsyncThunk(
  "product/add",
  async (data: Product | FormData) => {
    const config = data instanceof FormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : {};

    // Check if we need to adjust this to /products or if it was /product in original
    // Backend route is now mounted at /products
    const res = await api.post("/products", data, config);
    return res.data.data; // Extract data from response structure
  }
);


// ✅ UPDATE
export const updateProduct = createAsyncThunk(
  "product/update",
  async ({ id, data }: { id: string; data: Product | FormData }) => {
    const config = data instanceof FormData
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : {};

    const res = await api.put(`/products/${id}`, data, config);
    return res.data.data; // Extract data from response structure
  }
);


// ✅ DELETE
export const deleteProduct = createAsyncThunk(
  "product/delete",
  async (id: string) => {
    const res = await api.delete(`/products/${id}`);
    if (res.data.success) {
      return id;
    } else {
      throw new Error(res.data.message || "Failed to delete product");
    }
  }
);


// ==============================
// Slice
// ==============================

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      // ================= fetch
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch products";
      })


      // ================= fetch by id
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        // Update the product in the list or add it if not present
        const index = state.products.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.products[index] = action.payload;
        } else {
          state.products.push(action.payload);
        }
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to fetch product";
      })


      // ================= add
      .addCase(addProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.products.push(action.payload);
      })


      // ================= update
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        const index = state.products.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })


      // ================= delete
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.products = state.products.filter(
          (p) => p._id !== action.payload
        );
      });
  },
});


// ✅ IMPORTANT
export default productSlice.reducer;
