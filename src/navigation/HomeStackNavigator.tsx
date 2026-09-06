import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { HomeStackParamList } from './types';
import HomeFeedScreen from '../screens/home/HomeFeedScreen';
import SearchResultsScreen from '../screens/home/SearchResultsScreen';
import HospitalProfileScreen from '../screens/home/HospitalProfileScreen';
import DoctorProfileScreen from '../screens/home/DoctorProfileScreen';
import SlotSelectionCalendarScreen from '../screens/home/SlotSelectionCalendarScreen';
import SlotSelectionTimeGridScreen from '../screens/home/SlotSelectionTimeGridScreen';
import BookingSummaryScreen from '../screens/booking/BookingSummaryScreen';
import BookingConfirmationScreen from '../screens/booking/BookingConfirmationScreen';
import { colors } from '../theme/tokens';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="HomeFeed"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="HomeFeed" component={HomeFeedScreen} />
      <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
      <Stack.Screen name="HospitalProfile" component={HospitalProfileScreen} />
      <Stack.Screen name="DoctorProfile" component={DoctorProfileScreen} />
      <Stack.Screen name="SlotSelectionCalendar" component={SlotSelectionCalendarScreen} />
      <Stack.Screen name="SlotSelectionTimeGrid" component={SlotSelectionTimeGridScreen} />
      <Stack.Screen name="BookingSummary" component={BookingSummaryScreen} />
      <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
    </Stack.Navigator>
  );
}
