/* eslint-disable no-use-before-define */
import React, { useRef, useEffect, useState } from 'react';

import { useField } from '@unform/core';
import CheckBox from '@react-native-community/checkbox';

import { Text, View } from './styles';

const Checkbox = ({ name, options }) => {
  const inputRefs = useRef([]);
  const { fieldName, registerField, defaultValue = '' } = useField(name);

  const [checkboxValues, setCheckboxValues] = useState(defaultValue);

  useEffect(() => {
    inputRefs.current.forEach((ref, index) => {
      ref.value = options[index].value;

      ref.checked = checkboxValues.includes(options[index].value);
    });
  }, [checkboxValues, options]);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRefs.current,
      getValue: refs => {
        return refs.filter(ref => ref.checked).map(ref => ref.value);
      },
      clearValue: () => {
        setCheckboxValues();
      },
      setValue: (_, values) => {
        setCheckboxValues(values);
      },
    });
  }, [fieldName, registerField]);

  return (
    <>
      {options.map(option => (
        <View key={option.value}>
          <CheckBox
            disabled={false}
            value={checkboxValues.includes(option.value)}
            onValueChange={() => {
              setCheckboxValues(option.value);
            }}
            ref={ref => inputRefs.current.push(ref)}
          />
          <Text>{option.label}</Text>
        </View>
      ))}
    </>
  );
};

export default Checkbox;
