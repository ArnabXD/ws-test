import React, {useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {PaperProvider} from 'react-native-paper';
import {Provider} from 'react-redux';
import BootSplash from 'react-native-bootsplash';

import Navigation from './src/Navigation';
import {store} from './src/redux/store';

export default function App() {
  useEffect(() => {
    // TO DO - hide bootsplash on `onAuthStateChanged`
    const timer = setTimeout(() => BootSplash.hide(), 1500);
    return () => clearTimeout(timer);
  }, []);
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PaperProvider>
          <NavigationContainer>
            <Navigation />
          </NavigationContainer>
        </PaperProvider>
      </Provider>
    </SafeAreaProvider>
  );
}
