import {configureStore} from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import {all} from 'redux-saga/effects';

import authReducer from './features/auth/slice';
import watchAuth from './features/auth/saga';

const sagaMiddleware = createSagaMiddleware();

function* rootSaga() {
  yield all([watchAuth()]);
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
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
