import React from 'react';
import {Button} from 'react-native-paper';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {useDispatch, useSelector} from 'react-redux';

import {signIn} from '../redux/features/auth/slice';
import {RootState} from '../redux/store';
import {ScreenProp} from '../navtypes';

import RHFInput from '../components/RHFInput';
import Loader from '../components/Loader';

const schema = yup.object({
  email: yup.string().email().required('Please enter your email'),
  password: yup.string().required('Please enter your password'),
});

export default function Login({navigation}: ScreenProp<'Login'>) {
  const {control, handleSubmit, reset} = useForm({
    resolver: yupResolver(schema),
    defaultValues: {email: '', password: ''},
  });

  const {signInLoading} = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  return (
    <>
      <RHFInput
        control={control}
        name="email"
        placeholder="Email"
        autoCapitalize={'none'}
        autoCorrect={false}
      />
      <RHFInput
        control={control}
        name="password"
        placeholder="Password"
        secureTextEntry={true}
      />
      <Button
        mode="contained"
        style={{borderRadius: 8, margin: 10}}
        onPress={handleSubmit(data => dispatch(signIn(data)))}>
        Login
      </Button>
      <Button
        mode="contained-tonal"
        style={{borderRadius: 8, marginHorizontal: 10}}
        onPress={() => {
          navigation.navigate('Register');
          reset();
        }}>
        Register
      </Button>
      {signInLoading && <Loader />}
    </>
  );
}
