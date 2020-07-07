import 'react-native-gesture-handler';

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import Routes from './routes';

import './config/ReactotronConfig';

const Index = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#005338" />
      <Routes />
    </NavigationContainer>
  );
};

export default Index;
