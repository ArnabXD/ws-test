import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type StackScreens = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
};

export type ScreenProp<Screen extends keyof StackScreens> =
  NativeStackScreenProps<StackScreens, Screen>;
