import {configureStore} from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import {all} from 'redux-saga/effects';

import authReducer from './features/auth/slice';
import watchAuth from './features/auth/saga';

import productReducer from './features/products/slice';
import watchProduct from './features/products/saga';

const sagaMiddleware = createSagaMiddleware();

function* rootSaga() {
  yield all([watchAuth(), watchProduct()]);
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
  },
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware({serializableCheck: false}).concat(
      sagaMiddleware,
    );
  },
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
