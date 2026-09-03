import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoadingView } from './components/ui';

import LoginScreen from './screens/LoginScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import ServiceOrdersScreen from './screens/ServiceOrdersScreen';
import ServiceOrderDetailScreen from './screens/ServiceOrderDetailScreen';
import ServiceOrderCreateScreen from './screens/ServiceOrderCreateScreen';
import ServiceOrderAttendanceScreen from './screens/ServiceOrderAttendanceScreen';
import CeoListScreen from './screens/CeoListScreen';
import CeoDetailsScreen from './screens/CeoDetailsScreen';
import CeoCreateScreen from './screens/CeoCreateScreen';
import CeoFormScreen from './screens/CeoFormScreen';
import UsersScreen from './screens/UsersScreen';
import UserFormScreen from './screens/UserFormScreen';
import ChangePasswordScreen from './screens/ChangePasswordScreen';

const Stack = createNativeStackNavigator();

// Todas as telas desenham o próprio cabeçalho (HeroHeader/PageHeader),
// então o header nativo fica desligado em todo o stack — evita ter
// dois cabeçalhos empilhados com estilos diferentes.
const screenOptions = { headerShown: false };

function AuthenticatedNavigator() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="ServiceOrders" component={ServiceOrdersScreen} />
      <Stack.Screen name="ServiceOrderDetail" component={ServiceOrderDetailScreen} />
      <Stack.Screen name="ServiceOrderCreate" component={ServiceOrderCreateScreen} />
      <Stack.Screen name="ServiceOrderAttendance" component={ServiceOrderAttendanceScreen} />
      <Stack.Screen name="CeoList" component={CeoListScreen} />
      <Stack.Screen name="CeoDetails" component={CeoDetailsScreen} />
      <Stack.Screen name="CeoCreate" component={CeoCreateScreen} />
      <Stack.Screen name="CeoForm" component={CeoFormScreen} />
      <Stack.Screen name="Users" component={UsersScreen} />
      <Stack.Screen name="UserForm" component={UserFormScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    </Stack.Navigator>
  );
}

function GuestNavigator() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}

function Navigation() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) return <LoadingView />;

  return (
    <NavigationContainer>
      {isAuthenticated ? <AuthenticatedNavigator /> : <GuestNavigator />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Navigation />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
