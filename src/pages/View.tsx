import React, {useEffect} from 'react';
import {
  Headline,
  Subheading,
  Divider,
  Text,
  useTheme,
  Button,
} from 'react-native-paper';
import {
  ScrollView,
  StyleSheet,
  View,
  Image,
  ActivityIndicator,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';

import {getProduct, setData} from '../redux/features/products/slice';
import {RootState} from '../redux/store';
import {ScreenProp} from '../navtypes';

export default function ViewProduct({route, navigation}: ScreenProp<'View'>) {
  const dispatch = useDispatch();
  const {productInView} = useSelector((state: RootState) => state.products);
  const {colors} = useTheme();
  const {bottom} = useSafeAreaInsets();

  useEffect(() => {
    dispatch(getProduct(route.params.id));
    return () => {
      dispatch(
        setData({
          fetchingProductInView: false,
          productInView: null,
        }),
      );
    };
  }, [dispatch, route.params.id]);

  if (!productInView) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size={'large'} color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.main, {paddingBottom: bottom}]}>
      <ScrollView style={styles.main} bounces={false}>
        <Image source={{uri: productInView?.photo}} style={styles.photo} />
        <Headline>{productInView?.name}</Headline>
        <Subheading>{'₹' + productInView?.price}</Subheading>
        <Divider style={styles.divide} />
        <Subheading style={styles.desc}>Description</Subheading>
        <Text>{productInView?.description}</Text>
      </ScrollView>
      <Button
        mode="contained"
        style={styles.btn}
        onPress={() => navigation.goBack()}>
        Go Back
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    height: 300,
    width: 300,
    alignSelf: 'center',
    margin: 20,
    borderRadius: 12,
  },
  divide: {
    marginVertical: 12,
  },
  desc: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  btn: {
    marginTop: 12,
    borderRadius: 12,
  },
});
