import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import type { HomeStackParamList, MainTabParamList } from '../../navigation/types';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import ScreenContainer from '../../components/ScreenContainer';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryLink from '../../components/SecondaryLink';
import Card from '../../components/Card';
import { Body, Caption, Heading } from '../../components/Typography';
import { getDoctorById, getHospitalById } from '../../data/mockData';
import { getBookingById, type Booking } from '../../state/bookingsStore';
import { colors, spacing } from '../../theme/tokens';

type Props = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, 'BookingConfirmation'>,
  BottomTabScreenProps<MainTabParamList>
>;

export default function BookingConfirmationScreen({ navigation, route }: Props) {
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    let isActive = true;
    getBookingById(route.params.bookingId).then((result) => {
      if (isActive) setBooking(result);
    });
    return () => {
      isActive = false;
    };
  }, [route.params.bookingId]);

  if (!booking) {
    return <ScreenContainer centered>{null}</ScreenContainer>;
  }

  const doctor = getDoctorById(booking.doctorId);
  const hospital = getHospitalById(booking.hospitalId);
  const formattedDate = new Date(booking.date).toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <ScreenContainer centered>
      <View style={styles.iconCircle}>
        <Ionicons name="checkmark" size={56} color={colors.success.text} />
      </View>
      <Heading style={styles.heading}>Booking Confirmed!</Heading>

      <Card style={styles.recapCard}>
        <Caption>Booking ID: {booking.id}</Caption>
        <Body style={styles.doctorName}>{doctor?.name}</Body>
        <Caption>{hospital?.name}</Caption>
        <Caption>
          {formattedDate} · {booking.time}
        </Caption>
      </Card>

      <Caption style={styles.payNote}>Pay at the hospital — no online payment required.</Caption>

      <View style={styles.actions}>
        <PrimaryButton
          label="View booking"
          onPress={() => navigation.navigate('BookingsTab')}
        />
        <SecondaryLink label="Add to calendar" onPress={() => undefined} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.success.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  heading: {
    textAlign: 'center',
  },
  recapCard: {
    width: '100%',
    gap: 2,
    marginTop: spacing.xl,
  },
  doctorName: {
    fontSize: 16,
    marginTop: spacing.xs,
  },
  payNote: {
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    gap: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.xxxl,
  },
});
