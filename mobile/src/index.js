import 'react-native-gesture-handler';

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar, LogBox } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import AppProvider from './hooks';
import Routes from './routes';

import './config/ReactotronConfig';

const Index = () => {
  React.useEffect(() => {
    SplashScreen.hide();
  }, []);

  LogBox.ignoreAllLogs();

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#0F2417" />
      <AppProvider>
        <Routes />
      </AppProvider>
    </NavigationContainer>
  );
};

export default Index;
