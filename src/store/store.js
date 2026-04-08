import { configureStore } from "@reduxjs/toolkit";
import { mealApi } from "./apiSlice";

export const store = configureStore({
  reducer: {
    [mealApi.reducerPath]: mealApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(mealApi.middleware),
});