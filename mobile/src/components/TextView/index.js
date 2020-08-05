import React from 'react';
import Icon from 'react-native-vector-icons/Feather';
import PropTypes from 'prop-types';

import { Container, TextInput } from './styles';

const TextView = ({ icon, ...rest }) => {
  return (
    <Container>
      {icon && <Icon name={icon} size={20} color="rgba(255,255,255, 0.3)" />}
      <TextInput {...rest} />
    </Container>
  );
};

export default TextView;

TextView.propTypes = {
  icon: PropTypes.string,
};

TextView.defaultProps = {
  icon: null,
};
