import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Dashboard from '../screens/Dashboard';
import Animals from '../screens/Animals';
import Adoptions from '../screens/Adoptions';
import SignUpAnimal from '../screens/SignUpAnimal';
import SignUpAdoption from '../screens/SignUpAdoption';
import SignUpInstitution from '../screens/SignUpInstitution';
import ProfileUser from '../screens/ProfileUser';
import ProfileAnimal from '../screens/ProfileAnimal';
import ProfileInstitution from '../screens/ProfileInstituion';

const App = createStackNavigator();

const AppRoutes = () => (
  <App.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: {
        backgroundColor: '#005338',
      },
    }}
  >
    <App.Screen name="Dashboard" component={Dashboard} />
    <App.Screen name="Animals" component={Animals} />
    <App.Screen name="Adoptions" component={Adoptions} />

    <App.Screen name="SignUpAnimal" component={SignUpAnimal} />
    <App.Screen name="SignUpAdoption" component={SignUpAdoption} />
    <App.Screen name="SignUpInstitution" component={SignUpInstitution} />

    <App.Screen name="ProfileUser" component={ProfileUser} />
    <App.Screen name="ProfileAnimal" component={ProfileAnimal} />
    <App.Screen name="ProfileInstitution" component={ProfileInstitution} />
  </App.Navigator>
);

export default AppRoutes;
