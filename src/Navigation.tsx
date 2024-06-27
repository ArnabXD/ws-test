import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
import {useSelector, useDispatch} from 'react-redux';

import {setUser} from './redux/features/auth/slice';
import {RootState} from './redux/store';
import {StackScreens} from './navtypes';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import CreateOrUpdate from './pages/CreateOrUpdate';
import ViewProduct from './pages/View';

const Stack = createNativeStackNavigator<StackScreens>();

export default function Navigation() {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const sub = auth().onAuthStateChanged(_user => {
      if (_user) {
        dispatch(setUser(_user));
      }
    });
    return sub;
  }, [dispatch]);

  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen
            name="Home"
            options={{headerTitle: 'Products'}}
            component={Home}
          />
          <Stack.Screen
            name="CreateOrUpdate"
            component={CreateOrUpdate}
            options={({route}) => ({
              headerTitle: route.params?.docId
                ? 'Update Product'
                : 'Create Product',
            })}
          />
          <Stack.Screen
            name="View"
            component={ViewProduct}
            options={({route}) => ({headerTitle: route.params.name})}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </>
      )}
    </Stack.Navigator>
  );
}
