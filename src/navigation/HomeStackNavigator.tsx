import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
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

// Thin adapters wiring this stack's navigation onto the navigator-agnostic
// Slot Selection components — see those files' Props comments.
function SlotSelectionCalendarRoute({
  navigation,
  route,
}: NativeStackScreenProps<HomeStackParamList, 'SlotSelectionCalendar'>) {
  return (
    <SlotSelectionCalendarScreen
      doctorId={route.params.doctorId}
      onBack={navigation.goBack}
      onContinue={(date) =>
        navigation.navigate('SlotSelectionTimeGrid', { doctorId: route.params.doctorId, date })
      }
    />
  );
}

function SlotSelectionTimeGridRoute({
  navigation,
  route,
}: NativeStackScreenProps<HomeStackParamList, 'SlotSelectionTimeGrid'>) {
  return (
    <SlotSelectionTimeGridScreen
      doctorId={route.params.doctorId}
      date={route.params.date}
      onBack={navigation.goBack}
      onContinue={(time) =>
        navigation.navigate('BookingSummary', { doctorId: route.params.doctorId, date: route.params.date, time })
      }
    />
  );
}

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
      <Stack.Screen name="SlotSelectionCalendar" component={SlotSelectionCalendarRoute} />
      <Stack.Screen name="SlotSelectionTimeGrid" component={SlotSelectionTimeGridRoute} />
      <Stack.Screen name="BookingSummary" component={BookingSummaryScreen} />
      <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} />
    </Stack.Navigator>
  );
}
