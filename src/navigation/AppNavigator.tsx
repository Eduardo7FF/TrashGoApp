import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/ciudadano/ProfileScreen';

import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import CiudadanoHomeScreen from '../screens/ciudadano/CiudadanoHomeScreen';
import ConductorHomeScreen from '../screens/conductor/ConductorHomeScreen';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="CiudadanoHome" component={CiudadanoHomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="ConductorHome" component={ConductorHomeScreen} />
        <Stack.Screen name="AdminHome" component={AdminDashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}