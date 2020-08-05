import React, { useEffect, useRef, useState } from 'react';
import { Picker } from '@react-native-community/picker';
import { useField } from '@unform/core';

import { Touchable } from './styles';

const RNPicker = ({ name, options }) => {
  const inputRef = useRef(null);
  const { fieldName, registerField, defaultValue = '' } = useField(name);

  const [selectedValue, setSelectedValue] = useState(defaultValue);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      getValue: ref => ref.props.selectedValue,
      setValue: (_, value) => {
        setSelectedValue(value);
      },
      clearValue: () => {
        setSelectedValue('');
      },
    });
  }, [fieldName, registerField]);

  return (
    <Touchable
      selectedValue={selectedValue}
      onValueChange={itemValue => setSelectedValue(itemValue)}
    >
      <Picker
        ref={inputRef}
        selectedValue={selectedValue}
        onValueChange={itemValue => setSelectedValue(itemValue)}
      >
        <Picker.Item color="#648375" label="Selecione o estado" value="" />
        {options.map(option => (
          <Picker.Item
            color="#648375"
            key={option.value}
            label={option.label}
            value={option.value}
          />
        ))}
      </Picker>
    </Touchable>
  );
};

export default RNPicker;
