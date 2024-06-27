import {CallEffect, PutEffect, call, put, takeLatest} from 'redux-saga/effects';
import {nanoid} from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';
import type {FirestoreError} from '@react-native-firebase/firestore';
import storage, {FirebaseStorageTypes} from '@react-native-firebase/storage';
import {Alert} from 'react-native';

import {
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
  Product,
  CreateProductType,
} from './slice';
import {PayloadAction} from '@reduxjs/toolkit';

/** Fetch product using UID */
function* getProductsSaga(
  action: PayloadAction<string>,
): Generator<CallEffect | PutEffect, void, Product[]> {
  try {
    const getData = async (path: string, uid: string) => {
      const col = await firestore()
        .collection(path)
        .where('author', '==', uid)
        .get();
      return col.docs.map(data => ({...data.data(), id: data.id}));
    };

    const data = yield call(getData, 'products', action.payload);
    yield put(getProductsSuccess(data));
  } catch (error) {
    const {message} = error as FirestoreError;
    Alert.alert('Error', message);
    yield put(setData({fetchingProducts: false}));
  }
}

/** Fetch product with ID */
function* getProductSaga({
  payload,
}: PayloadAction<string>): Generator<CallEffect | PutEffect, void, Product> {
  try {
    const getData = async (path: string) => {
      const doc = await firestore().doc(path).get();
      return {...doc.data(), id: doc.id};
    };

    const data = yield call(getData, `products/${payload}`);
    yield put(getProductSuccess(data));
  } catch (error) {
    const {message} = error as FirestoreError;
    Alert.alert('Error', message);
    yield put(setData({fetchingProductInView: false}));
  }
}

function* createProductSaga(
  action: PayloadAction<CreateProductType>,
): Generator<CallEffect | PutEffect, void, Product> {
  try {
    const {photo, name, price, description, uid, onSuccess} = action.payload;
    const fileName = nanoid(16) + '.' + photo.split('.').pop();
    const photoRef = storage().ref('images/' + fileName);

    const _createProduct = async (ref: FirebaseStorageTypes.Reference) => {
      await ref.putFile(photo);
      const photoUrl = await ref.getDownloadURL();
      await firestore().collection('products').add({
        name,
        description,
        price,
        author: uid,
        photo: photoUrl,
      });
    };

    yield call(_createProduct, photoRef);
    yield put(createProductSuccess(onSuccess));
  } catch (error) {
    Alert.alert(
      error instanceof Error ? error.message : 'Something went wrong',
    );
    yield put(setData({creatingProduct: false}));
  }
}

function* updateProductSaga(action: PayloadAction<Product>) {
  try {
    yield call(async (data: typeof action.payload) => {
      const {id, ...toUpdate} = data;
      await firestore().collection('products').doc(data.id).update(toUpdate);
    }, action.payload);
    yield put(updateProductSuccess(action.payload));
    Alert.alert('Success', 'your product is updated');
  } catch (error) {
    Alert.alert(
      error instanceof Error ? error.message : 'Something went wrong',
    );
    yield put(setData({updatingProduct: false}));
  }
}

function* deleteProductSaga(action: PayloadAction<string>) {
  try {
    yield call(async (id: string) => {
      await firestore().collection('products').doc(id).delete();
    }, action.payload);
  } catch (error) {
    Alert.alert(
      error instanceof Error ? error.message : 'Something went wrong',
    );
  }
}

export default function* watchProduct() {
  yield takeLatest(getProducts.type, getProductsSaga);
  yield takeLatest(getProduct.type, getProductSaga);
  yield takeLatest(createProduct.type, createProductSaga);
  yield takeLatest(updateProduct.type, updateProductSaga);
  yield takeLatest(deleteProduct.type, deleteProductSaga);
}
