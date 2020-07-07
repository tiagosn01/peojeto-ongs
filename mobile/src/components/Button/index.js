import React from 'react';
import PropTypes from 'prop-types';

import {} from 'react-native-gesture-handler';

import { Container, ButtonText } from './styles';

const Button = ({ children, ...rest }) => {
  return (
    <Container {...rest}>
      <ButtonText>{children}</ButtonText>
    </Container>
  );
};

export default Button;

Button.propTypes = {
  children: PropTypes.string.isRequired,
  loading: PropTypes.bool,
};

Button.defaultProps = {
  loading: false,
};
