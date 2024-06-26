import React from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Modal,
  useWindowDimensions,
} from 'react-native';

export default function Loader() {
  const {height, width} = useWindowDimensions();
  return (
    <Modal style={StyleSheet.absoluteFillObject} transparent>
      <View
        style={{
          height,
          width,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.2)',
        }}>
        <ActivityIndicator color={'purple'} size="large" />
      </View>
    </Modal>
  );
}
