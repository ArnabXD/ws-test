import React, {useEffect, useCallback} from 'react';
import {
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  StyleSheet,
  Pressable,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from 'react-native';
import {Button, useTheme} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {useForm, useWatch} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ImageCropPicker from 'react-native-image-crop-picker';

import RHFInput from '../components/RHFInput';
import Loader from '../components/Loader';
import {ScreenProp} from '../navtypes';
import {RootState} from '../redux/store';
import {
  setData,
  getProduct,
  createProduct,
  updateProduct,
} from '../redux/features/products/slice';

const schema = yupResolver(
  yup.object({
    name: yup.string().required('Please enter product name'),
    description: yup.string().required('Please enter product description'),
    photo: yup.string().required(),
    price: yup
      .string()
      .matches(/^[0-9]+$/, {
        message: 'Must be a number string',
        excludeEmptyString: true,
      })
      .test('non-zero', "Price can't be zero", value => value !== '0')
      .required('Please enter price'),
  }),
);

export default function CreateOrUpdate({
  route,
  navigation,
}: ScreenProp<'CreateOrUpdate'>) {
  const products = useSelector((state: RootState) => state.products);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const {colors} = useTheme();

  const {
    control,
    setValue,
    handleSubmit,
    reset,
    formState: {errors},
  } = useForm({
    resolver: schema,
    defaultValues: {
      name: '',
      description: '',
      photo: '',
      price: '',
    },
  });
  const form = useWatch({control});

  const selectPhoto = useCallback(async () => {
    try {
      const photo = await ImageCropPicker.openPicker({cropping: true});
      setValue('photo', photo.path);
    } catch (_) {}
  }, [setValue]);

  useEffect(() => {
    if (route.params?.docId) {
      // fetch product if doc id is passed
      dispatch(getProduct(route.params.docId));
    } else {
      dispatch(setData({fetchingProductInView: false}));
    }

    // reset product state on unmount
    return () => {
      dispatch(
        setData({
          fetchingProductInView: false,
          productInView: null,
        }),
      );
    };
  }, [route.params, dispatch]);

  // Performance will be much better when every store is not a unnecessarily global store :)
  useEffect(() => {
    if (products.productInView) {
      setValue('name', products.productInView.name);
      setValue('description', products.productInView.description);
      setValue('photo', products.productInView.photo);
      setValue('price', products.productInView.price);
    }
    // we don't need to retrigger this in case setValue's reference is updated
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products.productInView]);

  return (
    <ScrollView style={styles.main} bounces={false}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.select({ios: 'position', default: 'height'})}
          keyboardVerticalOffset={50}>
          <Pressable onPress={selectPhoto} style={styles.photoArea}>
            <Image
              source={{
                uri:
                  form.photo ||
                  'https://placehold.jp/DDDDDD/6750a4/500x500.png?text=choose%20a%20photo',
              }}
              style={[
                styles.photo,
                errors.photo && {borderColor: colors.error, borderWidth: 2},
              ]}
              resizeMode="cover"
            />
          </Pressable>
          <RHFInput control={control} name="name" placeholder="Product Name" />
          <RHFInput
            control={control}
            name="description"
            placeholder="Description"
            multiline
            textAlignVertical="top"
            style={{height: 200, margin: 10}}
          />
          <RHFInput
            control={control}
            name="price"
            placeholder="Price"
            keyboardType="number-pad"
          />
          <Button
            mode="contained"
            style={styles.btn}
            onPress={handleSubmit(data => {
              dispatch(
                route.params?.docId
                  ? updateProduct({...data, id: route.params!.docId})
                  : createProduct({
                      ...data,
                      uid: user!.uid,
                      onSuccess: () =>
                        Alert.alert('Success', 'Product created', [
                          {
                            text: 'Go Back',
                            onPress: () => navigation.goBack(),
                          },
                          {
                            text: 'Create Another',
                            onPress: () => reset(),
                          },
                        ]),
                    }),
              );
            })}>
            {route.params?.docId ? 'Update Product' : 'Save Product'}
          </Button>
          {(products.fetchingProductInView ||
            products.creatingProduct ||
            products.updatingProduct) && <Loader />}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  main: {flex: 1},
  btn: {
    borderRadius: 8,
    margin: 10,
  },
  photoArea: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  photo: {
    height: 250,
    width: 250,
    borderRadius: 12,
  },
  photoError: {
    borderWidth: 2,
    borderColor: 'red',
  },
});
