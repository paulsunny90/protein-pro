import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../store/slice/productSlice";
import authReducer from "../store/slice/authSlice";
import cartReducer from "../store/slice/cartSlice";
import orderReducer from "../store/slice/orderSlice";
import addressReducer from "../store/slice/addressSlice";

export const store = configureStore({
  reducer: {
    product: productReducer,
    auth: authReducer,
    cart: cartReducer,
    order: orderReducer,
    address: addressReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;