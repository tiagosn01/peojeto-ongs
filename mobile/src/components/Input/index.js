import React from 'react';
import Icon from 'react-native-vector-icons/Feather';
import PropTypes from 'prop-types';

import { Container, TextInput } from './styles';

const Input = ({ name, icon, ...rest }) => {
  return (
    <Container>
      {icon && <Icon name={icon} size={20} color="rgba(255, 255, 255, 0.3)" />}
      <TextInput {...rest} />
    </Container>
  );
};

export default Input;

Input.propTypes = {
  name: PropTypes.string,
  icon: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

Input.defaultProps = {
  name: null,
  icon: null,
  style: {},
};
