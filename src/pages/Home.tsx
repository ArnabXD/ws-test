import React, {useCallback} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import {
  Button,
  Card,
  TouchableRipple,
  useTheme,
  Subheading,
  Caption,
} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {signOut} from '../redux/features/auth/slice';
import {getProducts, deleteProduct} from '../redux/features/products/slice';
import {RootState} from '../redux/store';
import {ScreenProp} from '../navtypes';

export default function Home({navigation}: ScreenProp<'Home'>) {
  const auth = useSelector((state: RootState) => state.auth);
  const {products, fetchingProducts} = useSelector(
    (state: RootState) => state.products,
  );
  const dispatch = useDispatch();
  const {colors} = useTheme();

  useFocusEffect(
    useCallback(() => {
      dispatch(getProducts(auth.user!.uid));
    }, [dispatch]),
  );

  if (fetchingProducts) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size={'large'} color={colors.primary} />
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={products}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.flContainer}
        renderItem={({item}) => (
          <TouchableRipple
            style={styles.mb10}
            onPress={() => navigation.navigate('View', item)}>
            <Card style={styles.card}>
              <View style={styles.row}>
                <Image source={{uri: item.photo}} style={styles.productImage} />
                <View style={styles.infoArea}>
                  <View>
                    <Subheading numberOfLines={1}>{item.name}</Subheading>
                    <Caption numberOfLines={2}>{item.description}</Caption>
                  </View>
                  <View style={styles.row}>
                    <TouchableRipple
                      onPress={() =>
                        navigation.navigate('CreateOrUpdate', {docId: item.id})
                      }>
                      <Icon
                        name="pencil-circle"
                        color={colors.primary}
                        size={32}
                      />
                    </TouchableRipple>
                    <TouchableRipple
                      onPress={() => dispatch(deleteProduct(item.id))}>
                      <Icon
                        name="delete-circle"
                        color={colors.error}
                        size={32}
                      />
                    </TouchableRipple>
                  </View>
                </View>
              </View>
            </Card>
          </TouchableRipple>
        )}
      />
      <Button
        mode="contained"
        style={styles.btn}
        onPress={() => navigation.navigate('CreateOrUpdate')}>
        Add Product
      </Button>
      <Button
        mode="contained"
        style={styles.btn}
        onPress={() => dispatch(signOut())}>
        Sign out
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    borderRadius: 8,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
  },
  productImage: {
    height: 100,
    width: 100,
    borderRadius: 8,
    resizeMode: 'cover',
    backgroundColor: '#DDDDDD',
  },
  flContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  card: {
    padding: 12,
  },
  mb10: {
    marginBottom: 10,
  },
  infoArea: {
    flex: 1,
    flexShrink: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
});
