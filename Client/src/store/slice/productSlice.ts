import { createSlice, createAsyncThunk,  } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import axios from "axios";


// ✅ axios instance (cleaner)
const api = axios.create({
  baseURL: "http://localhost:5000/api/product",
});


// ==============================
// Types
// ==============================

export interface Product {
  _id?: string;
  name: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  imageUrl?: string;
  isActive: boolean;
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


// ==============================
// Async Thunks (API calls)
// ==============================

// ✅ GET ALL
export const fetchProducts = createAsyncThunk(
  "product/fetchAll",
  async () => {
    const res = await api.get("/");
    return res.data.data; // Extract data from response structure
  }
);


// ✅ ADD
export const addProduct = createAsyncThunk(
  "product/add",
  async (data: Product | FormData) => {
    const config = data instanceof FormData 
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : {};
    
    const res = await api.post("/", data, config);
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
    
    const res = await api.put(`/${id}`, data, config);
    return res.data.data; // Extract data from response structure
  }
);


// ✅ DELETE
export const deleteProduct = createAsyncThunk(
  "product/delete",
  async (id: string) => {
    const res = await api.delete(`/${id}`);
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
