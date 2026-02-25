import { createSlice, createAsyncThunk, } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import api from '../../utils/api';
import { formatImageUrl } from "../../utils/imageUtils";

// ==============================
// Types
// ==============================

export interface Review {
  _id?: string;
  name: string;
  rating: number;
  comment: string;
  user: string;
  createdAt?: string;
}

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
  rating: number;
  reviewCount: number;
  image: string;
  imageUrl?: string;
  images?: string[];
  isActive: boolean;
  inStock: boolean;
  discount: number;
  reviews?: Review[];
  numReviews?: number;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  stock?: number;
  createdAt?: string;
  updatedAt?: string;
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
      image: formatImageUrl(p.images?.[0] || p.imageUrl),
      images: p.images?.map((img: string) => formatImageUrl(img)) || [],
      rating: p.rating || 0,
      reviewCount: p.numReviews || 0,
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
        rating: p.rating || 0,
        reviewCount: p.numReviews || 0,
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

    const res = await api.post("/products", data, config);
    return res.data.data;
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
    return res.data.data;
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

// ✅ CREATE REVIEW
export const createProductReview = createAsyncThunk(
  "product/createReview",
  async ({ productId, rating, comment }: { productId: string; rating: number; comment: string }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/products/${productId}/reviews`, { rating, comment });
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to add review");
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
      })

      // ================= create review
      .addCase(createProductReview.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProductReview.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createProductReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to add review";
      });
  },
});


// ✅ IMPORTANT
export default productSlice.reducer;
