import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import FavoriteScreen from '../screens/FavoriteScreen';
import DetailsScreen from '../screens/DetailsScreen';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import SettingsScreen from '@/screens/SettingsScreen';
import i18n from './../config/i18n'; 

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export type StackNavigaton = {
  Home: undefined;
  Favoritos: undefined;
  Details: undefined;
  Settings: undefined;
};

export type StackTypes = NativeStackNavigationProp<StackNavigaton>;

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeStack" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Details" component={DetailsScreen} options={{ headerShown: false }} />
      <Stack.Screen name="FavoritosStack" component={FavoriteScreen} options={{ headerShown: false }} />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{
          headerStyle: {
            backgroundColor: '#333',
            
          },
          headerTitleStyle: {
            color: 'white',
            fontSize:30
          },
          headerTintColor: 'white', 
        }} 
        />

    </Stack.Navigator>
  );
}

function FavoriteStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="FavoritosStack" component={FavoriteScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default function TabComponent() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: 'black', 
          borderTopWidth: 0, 
        },
        tabBarActiveTintColor: 'white', 
        tabBarInactiveTintColor: 'gray', 
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? 'HomeStack';
          const shouldHideTabBar = routeName === 'Details' || 'Settings';

          return {
            tabBarLabel: 'Discover',
            tabBarIcon: ({ color, size }) => <Ionicons name="search" color={color} size={25} />,
            headerShown: false, 
            tabBarStyle: shouldHideTabBar
              ? { display: 'none' }
              : { backgroundColor: 'black', borderTopWidth: 0 }, 
          };
        }}
      />
      <Tab.Screen
        name="FavoritosTab"
        component={FavoriteStack}
        options={{
          tabBarLabel: 'Collection',
          tabBarIcon: ({ color, size }) => <Ionicons name="bookmark" color={color} size={25} />,
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}


