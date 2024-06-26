import React from 'react';
import {View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {useDispatch} from 'react-redux';
import {signOut} from '../redux/features/auth/slice';

export default function Home() {
  const dispatch = useDispatch();
  return (
    <View>
      <Text>Home</Text>
      <Button onPress={() => dispatch(signOut())}>Sign out</Button>
    </View>
  );
}
