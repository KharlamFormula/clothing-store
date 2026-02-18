import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    isOpen: false
  },
  reducers: {
    addToCart(state, action) {
      state.items.push(action.payload);
    },
    removeFromCart(state, action) {
      state.items.splice(action.payload, 1);
    },
    openCart(state) {
      state.isOpen = true;
    },
    closeCart(state) {
      state.isOpen = false;
    },
    clearCart(state) {
      state.items = [];
    }
  }
});

export const {
  addToCart,
  removeFromCart,
  openCart,
  closeCart,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;

