import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type StackScreens = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  CreateOrUpdate?: {docId: string};
  View: {id: string; name: string};
};

export type ScreenProp<Screen extends keyof StackScreens> =
  NativeStackScreenProps<StackScreens, Screen>;
