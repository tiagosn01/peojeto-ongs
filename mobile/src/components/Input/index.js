import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import Icon from 'react-native-vector-icons/Feather';
import PropTypes from 'prop-types';
import { useField } from '@unform/core';

import { Container, TextInput } from './styles';

const Input = ({ name, icon, ...rest }, ref) => {
  const inputElementRef = useRef(null);
  const { registerField, defaultValue = '', fieldName, error } = useField(name);
  const inputValueRef = useRef({ value: '' });

  useImperativeHandle(ref, () => ({
    focus() {
      inputElementRef.current.focus();
    },
  }));

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputValueRef.current,
      path: 'value',
      setValue(value) {
        inputValueRef.current.value = value;
        inputElementRef.current.setNativeProps({ text: value });
      },
      clearValue() {
        inputValueRef.current.value = '';
        inputElementRef.current.clear();
      },
    });
  }, [fieldName, registerField]);

  return (
    <Container isErrored={!!error}>
      {icon && <Icon name={icon} size={20} color="rgba(255,255,255, 0.3)" />}
      <TextInput
        ref={inputElementRef}
        defaultValue={defaultValue}
        onChangeText={value => {
          inputValueRef.current.value = value;
        }}
        {...rest}
      />
    </Container>
  );
};

export default forwardRef(Input);

Input.propTypes = {
  name: PropTypes.string.isRequired,
  icon: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

Input.defaultProps = {
  icon: null,
  style: {},
};
