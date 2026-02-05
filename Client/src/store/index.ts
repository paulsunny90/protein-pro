import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../store/slice/productSlice";

export const store = configureStore({
  reducer: {
    product: productReducer, // ✅ MUST be object
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;