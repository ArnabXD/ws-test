import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

interface Product {
  id: string;
  name: string;
  description: string;
  array: string;
  price: string;
}

interface ProductsState {
  products: Array<Product>;
  fetchingProducts: boolean;
  productsFetchError: string | null;
  productInView: Product | null;
  fetchingProductInView: boolean;
  fetchingProductInViewError: string | null;
}

const initialState: ProductsState = {
  products: [],
  fetchingProducts: false,
  productsFetchError: null,
  productInView: null,
  fetchingProductInView: false,
  fetchingProductInViewError: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    getProducts: (state, _action: PayloadAction<string>) => {
      state.fetchingProducts = true;
      state.productsFetchError = null;
    },
    getProductsSuccess: (
      state,
      action: PayloadAction<ProductsState['products']>,
    ) => {
      state.fetchingProducts = false;
      state.products = action.payload;
    },
    getProductsFail: (state, {payload}: PayloadAction<string>) => {
      state.fetchingProducts = false;
      state.productsFetchError = payload;
    },
    getProduct: (state, _action: PayloadAction<string>) => {
      state.fetchingProductInView = true;
    },
    getProductSuccess: (state, action: PayloadAction<Product>) => {
      state.fetchingProductInView = false;
      state.productInView = action.payload;
    },
    getProductFail: (state, action: PayloadAction<string>) => {
      state.fetchingProductInView = false;
      state.fetchingProductInViewError = action.payload;
    },
  },
});

export const {
  getProduct,
  getProductFail,
  getProductSuccess,
  getProducts,
  getProductsFail,
  getProductsSuccess,
} = productSlice.actions;
export default productSlice.reducer;
