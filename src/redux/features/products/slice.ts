import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

export interface Product {
  id: string;
  name: string;
  description: string;
  photo: string;
  price: string;
}

export type CreateProductType = Omit<Product, 'id'> & {
  uid: string;
  onSuccess: () => unknown;
};

export interface ProductsState {
  products: Array<Product>;
  fetchingProducts: boolean;
  productInView: Product | null;
  fetchingProductInView: boolean;
  creatingProduct: boolean;
  updatingProduct: boolean;
}

const initialState: ProductsState = {
  products: [],
  fetchingProducts: false,
  productInView: null,
  fetchingProductInView: false,
  creatingProduct: false,
  updatingProduct: false,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    getProducts: (state, _action: PayloadAction<string>) => {
      // don't show this loader for refetching
      if (!state.products.length) {
        state.fetchingProducts = true;
      }
    },
    getProductsSuccess: (
      state,
      action: PayloadAction<ProductsState['products']>,
    ) => {
      state.fetchingProducts = false;
      state.products = action.payload;
    },
    getProduct: (state, _action: PayloadAction<string>) => {
      state.fetchingProductInView = true;
    },
    getProductSuccess: (state, action: PayloadAction<Product>) => {
      state.fetchingProductInView = false;
      state.productInView = action.payload;
    },
    createProduct: (state, _action: PayloadAction<CreateProductType>) => {
      state.creatingProduct = true;
    },
    createProductSuccess: (state, action: PayloadAction<() => unknown>) => {
      state.creatingProduct = false;
      action.payload();
    },
    updateProduct: (state, _action: PayloadAction<Product>) => {
      state.updatingProduct = true;
    },
    updateProductSuccess: (state, {payload}: PayloadAction<Product>) => {
      return {
        ...state,
        productInView: {
          ...state.productInView!,
          ...payload,
        },
        updatingProduct: false,
        products: state.products.map(item => {
          if (item.id === state.productInView?.id) {
            return {...state.productInView, ...payload};
          }
          return item;
        }),
      };
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(
        data => data.id !== action.payload,
      );
    },
    setData: (state, action: PayloadAction<Partial<ProductsState>>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const {
  getProduct,
  getProductSuccess,
  getProducts,
  getProductsSuccess,
  createProduct,
  createProductSuccess,
  updateProduct,
  updateProductSuccess,
  deleteProduct,
  setData,
} = productSlice.actions;
export default productSlice.reducer;
