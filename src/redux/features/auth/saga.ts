import {call, put, takeLatest, PutEffect, CallEffect} from 'redux-saga/effects';
import type {PayloadAction} from '@reduxjs/toolkit';
import auth from '@react-native-firebase/auth';
import type {FirebaseAuthTypes} from '@react-native-firebase/auth';

import {
  signIn,
  signInSuccess,
  signFail,
  signUp,
  signUpSuccess,
  signUpFailure,
  LoginPayload,
  signOut,
} from './slice';

function* signInSaga(
  action: PayloadAction<LoginPayload>,
): Generator<PutEffect | CallEffect, void, FirebaseAuthTypes.UserCredential> {
  try {
    const {email, password} = action.payload;

    // directly passing the function was throwing errors, signInWithEmailAndPassword was undefined
    const signInWithEmailAndPassword = (_email: string, _password: string) =>
      auth().signInWithEmailAndPassword(_email, _password);

    const data = yield call(signInWithEmailAndPassword, email, password);

    yield put(signInSuccess(data.user));
  } catch (err) {
    const error = err as FirebaseAuthTypes.NativeFirebaseAuthError;
    yield put(signFail(error.nativeErrorMessage ?? error.message));
  }
}

function* signUpSaga(
  action: PayloadAction<LoginPayload>,
): Generator<PutEffect | CallEffect, void, FirebaseAuthTypes.UserCredential> {
  try {
    const {email, password} = action.payload;
    const createUserWithEmailAndPassword = (
      _email: string,
      _password: string,
    ) => auth().createUserWithEmailAndPassword(_email, _password);

    const data = yield call(createUserWithEmailAndPassword, email, password);

    yield put(signUpSuccess(data.user));
  } catch (err) {
    const error = err as FirebaseAuthTypes.NativeFirebaseAuthError;
    yield put(signUpFailure(error.message));
  }
}

function* signOutSaga() {
  try {
    const _signOut = () => auth().signOut();
    yield call(_signOut);
    yield put(signOut());
  } catch (_error) {}
}

export default function* watchAuth() {
  yield takeLatest(signIn.type, signInSaga);
  yield takeLatest(signUp.type, signUpSaga);
  yield takeLatest(signOut.type, signOutSaga);
}
