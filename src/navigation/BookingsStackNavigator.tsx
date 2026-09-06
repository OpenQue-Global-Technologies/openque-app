import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BookingsStackParamList } from './types';
import BookingsScreen from '../screens/bookings/BookingsScreen';
import AppointmentDetailScreen from '../screens/bookings/AppointmentDetailScreen';
import RescheduleConfirmScreen from '../screens/bookings/RescheduleConfirmScreen';
import CancelConfirmationScreen from '../screens/bookings/CancelConfirmationScreen';
import SlotSelectionCalendarScreen from '../screens/home/SlotSelectionCalendarScreen';
import SlotSelectionTimeGridScreen from '../screens/home/SlotSelectionTimeGridScreen';
import { colors } from '../theme/tokens';

const Stack = createNativeStackNavigator<BookingsStackParamList>();

// Reuses the Phase 2 Slot Selection components (see their Props comments)
// for the patient-initiated reschedule flow, Section 6.2.
function RescheduleCalendarRoute({
  navigation,
  route,
}: NativeStackScreenProps<BookingsStackParamList, 'RescheduleCalendar'>) {
  return (
    <SlotSelectionCalendarScreen
      doctorId={route.params.doctorId}
      onBack={navigation.goBack}
      onContinue={(date) =>
        navigation.navigate('RescheduleTimeGrid', {
          bookingId: route.params.bookingId,
          doctorId: route.params.doctorId,
          date,
        })
      }
    />
  );
}

function RescheduleTimeGridRoute({
  navigation,
  route,
}: NativeStackScreenProps<BookingsStackParamList, 'RescheduleTimeGrid'>) {
  return (
    <SlotSelectionTimeGridScreen
      doctorId={route.params.doctorId}
      date={route.params.date}
      onBack={navigation.goBack}
      onContinue={(time) =>
        navigation.navigate('RescheduleConfirm', {
          bookingId: route.params.bookingId,
          doctorId: route.params.doctorId,
          date: route.params.date,
          time,
        })
      }
    />
  );
}

export default function BookingsStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="BookingsList"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="BookingsList" component={BookingsScreen} />
      <Stack.Screen name="AppointmentDetail" component={AppointmentDetailScreen} />
      <Stack.Screen name="RescheduleCalendar" component={RescheduleCalendarRoute} />
      <Stack.Screen name="RescheduleTimeGrid" component={RescheduleTimeGridRoute} />
      <Stack.Screen name="RescheduleConfirm" component={RescheduleConfirmScreen} />
      <Stack.Screen name="CancelConfirmation" component={CancelConfirmationScreen} />
    </Stack.Navigator>
  );
}
