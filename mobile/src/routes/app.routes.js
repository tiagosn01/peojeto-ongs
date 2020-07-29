import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Dashboard from '../screens/Dashboard';
import Animals from '../screens/Animals';
import Adoptions from '../screens/Adoptions';
import RegisterAnimal from '../screens/RegisterAnimal';
import RegisterAdoption from '../screens/RegisterAdoption';
import AvatarInstitution from '../screens/AvatarInstitution';
import ProfileUser from '../screens/ProfileUser';
import ProfileAnimal from '../screens/ProfileAnimal';
import ProfileInstitution from '../screens/ProfileInstituion';
import RegisterInstitution from '../screens/RegisterInstitution';
import AvatarAnimal from '../screens/AvatarAnimal';

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

    <App.Screen name="RegisterInstitution" component={RegisterInstitution} />
    <App.Screen name="AvatarInstitution" component={AvatarInstitution} />

    <App.Screen name="AvatarAnimal" component={AvatarAnimal} />
    <App.Screen name="RegisterAnimal" component={RegisterAnimal} />
    <App.Screen name="RegisterAdoption" component={RegisterAdoption} />

    <App.Screen name="ProfileUser" component={ProfileUser} />
    <App.Screen name="ProfileAnimal" component={ProfileAnimal} />
    <App.Screen name="ProfileInstitution" component={ProfileInstitution} />
  </App.Navigator>
);

export default AppRoutes;
