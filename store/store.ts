import { configureStore } from "@reduxjs/toolkit";
import expensesReducer from "./slices/expensesSlice";
import categoriesReduces from "./slices/categorySlice";
export const store = configureStore({
  reducer: {
    expenses: expensesReducer,
    categories: categoriesReduces,
  },
});
