import React from 'react';
import {Text, TextInput, TextInputProps, useTheme} from 'react-native-paper';
import {StyleSheet} from 'react-native';
import {Controller, Control, FieldValues, Path} from 'react-hook-form';

export type RHFInputProps<T extends FieldValues = {}> = {
  control: Control<T, unknown>;
  name: Path<T>;
} & TextInputProps;

const RHFInput = <T extends FieldValues>({
  control,
  name,
  ...rest
}: RHFInputProps<T>) => {
  const {colors} = useTheme();
  return (
    <Controller
      control={control}
      name={name}
      render={({field: {onChange, onBlur, value}, formState: {errors}}) => (
        <>
          <TextInput
            mode="outlined"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={styles.inputBox}
            placeholderTextColor="grey"
            {...rest}
          />
          {name in errors ? (
            <Text style={{color: colors.error, marginHorizontal: 12}}>
              {errors[name]!.message?.toString()}
            </Text>
          ) : null}
        </>
      )}
    />
  );
};

const styles = StyleSheet.create({
  inputBox: {
    margin: 10,
    fontSize: 16,
    borderColor: '#d3d3d3',
    borderBottomWidth: 1,
    color: 'white',
  },
});

export default RHFInput;
