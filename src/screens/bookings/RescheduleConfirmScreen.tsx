import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BookingsStackParamList } from '../../navigation/types';
import ScreenContainer from '../../components/ScreenContainer';
import BackButton from '../../components/BackButton';
import Card from '../../components/Card';
import PrimaryButton from '../../components/PrimaryButton';
import { Body, Caption, Heading } from '../../components/Typography';
import { getDoctorById, getHospitalById } from '../../data/mockData';
import { rescheduleBooking } from '../../state/bookingsStore';
import { colors, spacing } from '../../theme/tokens';

type Props = NativeStackScreenProps<BookingsStackParamList, 'RescheduleConfirm'>;

export default function RescheduleConfirmScreen({ navigation, route }: Props) {
  const { bookingId, doctorId, date, time } = route.params;
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
    await rescheduleBooking(bookingId, { date, time });
    setIsConfirming(false);
    // Pop back past RescheduleCalendar and RescheduleTimeGrid to the
    // Appointment Detail screen that started this flow, rather than
    // navigate('AppointmentDetail', ...) — which pushes a new instance
    // instead of popping this fixed-depth sub-flow.
    navigation.pop(3);
  };

  return (
    <ScreenContainer>
      <View style={styles.topRow}>
        <BackButton onPress={navigation.goBack} />
      </View>

      <Heading>Confirm New Slot</Heading>

      <Card style={styles.recapCard}>
        <Body style={styles.doctorName}>{doctor.name}</Body>
        <Caption>{doctor.specialty}</Caption>
        <Caption>{hospital.name}</Caption>
        <View style={styles.divider} />
        <Caption>{formattedDate}</Caption>
        <Caption>{time}</Caption>
      </Card>

      <Caption style={styles.note}>Rescheduling is free, any time before your appointment.</Caption>

      <View style={styles.footer}>
        <PrimaryButton label="Confirm new slot" onPress={handleConfirm} loading={isConfirming} />
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
  note: {
    marginTop: spacing.xl,
  },
  footer: {
    marginTop: 'auto',
    paddingBottom: spacing.xl,
  },
});
