import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import type { MainTabParamList } from './types';
import HomeStackNavigator from './HomeStackNavigator';
import BookingsStackNavigator from './BookingsStackNavigator';
import QueueScreen from '../screens/queue/QueueScreen';
import ProfileStackNavigator from './ProfileStackNavigator';
import { useLanguage } from '../i18n/LanguageContext';
import { colors, fonts } from '../theme/tokens';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICONS: Record<keyof MainTabParamList, keyof typeof Ionicons.glyphMap> = {
  HomeTab: 'home',
  BookingsTab: 'calendar',
  QueueTab: 'time',
  ProfileTab: 'person',
};

export default function MainTabNavigator() {
  const { t } = useLanguage();

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
      <Tab.Screen name="HomeTab" component={HomeStackNavigator} options={{ title: t('tabHome') }} />
      <Tab.Screen
        name="BookingsTab"
        component={BookingsStackNavigator}
        options={{ title: t('tabBookings') }}
      />
      <Tab.Screen name="QueueTab" component={QueueScreen} options={{ title: t('tabQueue') }} />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{ title: t('tabProfile') }}
      />
    </Tab.Navigator>
  );
}
