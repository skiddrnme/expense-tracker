import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
};

export const categorieSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    addCategories: (state, action) => {
      state.categories.push(action.payload);
    },
    removeCategories: (state, action) => {
      state.categories = state.categories.filter(
        (item) => item.id !== action.payload.id
      );
    },
  },
});

export const { addCategories, removeCategories } = categorieSlice.actions;

export const selectCategories = (state) => state.categories.categories;

export default categorieSlice.reducer;
