import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import type {FirebaseAuthTypes} from '@react-native-firebase/auth';

import {Alert} from 'react-native';

export interface AuthState {
  user: FirebaseAuthTypes.User | null;
  signInLoading: boolean;
  signInError: string | null;
  signUpLoading: boolean;
  signUpError: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

const initialState: AuthState = {
  user: null,
  signInLoading: false,
  signInError: null,
  signUpLoading: false,
  signUpError: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn: (state, _action: PayloadAction<LoginPayload>) => {
      state.signInLoading = true;
      state.signInError = null;
    },
    signInSuccess: (
      state,
      {payload}: PayloadAction<FirebaseAuthTypes.User>,
    ) => {
      state.user = payload;
      state.signInLoading = false;
      state.signInError = null;
    },
    signFail: (state, {payload}: PayloadAction<string>) => {
      state.signInLoading = false;
      state.signInError = payload;
      Alert.alert('Error', payload);
    },
    signUp: (state, _action: PayloadAction<LoginPayload>) => {
      state.signUpLoading = true;
      state.signUpError = null;
    },
    signUpSuccess: (state, action: PayloadAction<FirebaseAuthTypes.User>) => {
      state.signUpLoading = false;
      state.user = action.payload;
    },
    signUpFailure: (state, action: PayloadAction<string>) => {
      state.signUpLoading = false;
      state.signUpError = action.payload;
    },
    setUser: (state, {payload}: PayloadAction<FirebaseAuthTypes.User>) => {
      state.user = payload;
      state.signInLoading = false;
      state.signInError = null;
    },
    signOut: () => initialState,
  },
});

export const {
  signIn,
  signInSuccess,
  signFail,
  signUp,
  signUpSuccess,
  signUpFailure,
  setUser,
  signOut,
} = authSlice.actions;
export default authSlice.reducer;
