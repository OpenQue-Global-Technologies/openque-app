import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import type { MainTabParamList } from './types';
import HomeStackNavigator from './HomeStackNavigator';
import BookingsStubScreen from '../screens/bookings/BookingsStubScreen';
import QueueStubScreen from '../screens/queue/QueueStubScreen';
import ProfileStubScreen from '../screens/profile/ProfileStubScreen';
import { colors, fonts } from '../theme/tokens';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICONS: Record<keyof MainTabParamList, keyof typeof Ionicons.glyphMap> = {
  HomeTab: 'home',
  BookingsTab: 'calendar',
  QueueTab: 'time',
  ProfileTab: 'person',
};

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.neutralMuted,
        tabBarStyle: { backgroundColor: colors.white },
        tabBarLabelStyle: { fontFamily: fonts.bodyMedium, fontSize: 11 },
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={TAB_ICONS[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStackNavigator} options={{ title: 'Home' }} />
      <Tab.Screen name="BookingsTab" component={BookingsStubScreen} options={{ title: 'Bookings' }} />
      <Tab.Screen name="QueueTab" component={QueueStubScreen} options={{ title: 'Queue' }} />
      <Tab.Screen name="ProfileTab" component={ProfileStubScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}
