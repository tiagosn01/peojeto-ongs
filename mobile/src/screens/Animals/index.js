import React from 'react';
import { View, Button } from 'react-native';

import { useAuth } from '../../hooks/auth';

// import { Container } from './styles';

const Animals = () => {
  const { signOut } = useAuth();

  return (
    <View>
      <Button title="Sair" onPress={signOut}>
        Sair
      </Button>
    </View>
  );
};

export default Animals;