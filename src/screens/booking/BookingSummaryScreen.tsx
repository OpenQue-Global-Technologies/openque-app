import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../navigation/types';
import ScreenContainer from '../../components/ScreenContainer';
import BackButton from '../../components/BackButton';
import Card from '../../components/Card';
import PrimaryButton from '../../components/PrimaryButton';
import { Body, Caption, Heading } from '../../components/Typography';
import { getDoctorById, getHospitalById } from '../../data/mockData';
import { colors, spacing } from '../../theme/tokens';
import { addBooking } from '../../state/bookingsStore';

type Props = NativeStackScreenProps<HomeStackParamList, 'BookingSummary'>;

export default function BookingSummaryScreen({ navigation, route }: Props) {
  const { doctorId, date, time } = route.params;
  const doctor = getDoctorById(doctorId);
  const hospital = doctor ? getHospitalById(doctor.hospitalId) : undefined;
  const [isConfirming, setIsConfirming] = useState(false);

  if (!doctor || !hospital) {
    return (
      <ScreenContainer centered>
        <Body>Doctor not found.</Body>
      </ScreenContainer>
    );
  }

  const formattedDate = new Date(date).toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const handleConfirm = async () => {
    setIsConfirming(true);
    const booking = await addBooking({
      doctorId,
      hospitalId: hospital.id,
      date,
      time,
      feeInr: doctor.feeInr,
    });
    setIsConfirming(false);
    navigation.replace('BookingConfirmation', { bookingId: booking.id });
  };

  return (
    <ScreenContainer>
      <View style={styles.topRow}>
        <BackButton onPress={navigation.goBack} />
      </View>

      <Heading>Booking Summary</Heading>

      <Card style={styles.recapCard}>
        <Body style={styles.doctorName}>{doctor.name}</Body>
        <Caption>{doctor.specialty}</Caption>
        <Caption>{hospital.name}</Caption>
        <View style={styles.divider} />
        <Caption>{formattedDate}</Caption>
        <Caption>{time}</Caption>
      </Card>

      <Caption style={styles.feeNote}>
        Consultation fee: ₹{doctor.feeInr}, payable at the hospital.
      </Caption>
      <Caption style={styles.cancellationNote}>
        Free cancellation any time before your appointment.
      </Caption>

      <View style={styles.footer}>
        <PrimaryButton label="Confirm Booking" onPress={handleConfirm} loading={isConfirming} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topRow: {
    minHeight: 44,
    justifyContent: 'center',
  },
  recapCard: {
    gap: 2,
    marginTop: spacing.xl,
  },
  doctorName: {
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: colors.background,
    marginVertical: spacing.sm,
  },
  feeNote: {
    marginTop: spacing.xl,
  },
  cancellationNote: {
    marginTop: spacing.xs,
  },
  footer: {
    marginTop: 'auto',
    paddingBottom: spacing.xl,
  },
});
