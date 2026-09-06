import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BookingsStackParamList } from '../../navigation/types';
import ScreenContainer from '../../components/ScreenContainer';
import BackButton from '../../components/BackButton';
import Card from '../../components/Card';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryLink from '../../components/SecondaryLink';
import { Body, Caption, Heading } from '../../components/Typography';
import { getDoctorById, getHospitalById } from '../../data/mockData';
import { cancelBooking, getBookingById, type Booking } from '../../state/bookingsStore';
import { colors, spacing } from '../../theme/tokens';

type Props = NativeStackScreenProps<BookingsStackParamList, 'CancelConfirmation'>;

export default function CancelConfirmationScreen({ navigation, route }: Props) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

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

  const handleConfirm = async () => {
    setIsCancelling(true);
    await cancelBooking(booking.id);
    setIsCancelling(false);
    navigation.popToTop();
  };

  return (
    <ScreenContainer>
      <View style={styles.topRow}>
        <BackButton onPress={navigation.goBack} />
      </View>

      <Heading>Cancel Appointment</Heading>

      <Card style={styles.recapCard}>
        <Body style={styles.doctorName}>{doctor?.name}</Body>
        <Caption>{hospital?.name}</Caption>
        <Caption>
          {formattedDate} · {booking.time}
        </Caption>
      </Card>

      <Caption style={styles.copy}>
        Your slot will be released. Since payment is collected at the hospital, no refund transaction is
        needed.
      </Caption>

      <View style={styles.footer}>
        <PrimaryButton label="Confirm cancellation" onPress={handleConfirm} loading={isCancelling} />
        <SecondaryLink label="Keep appointment" onPress={navigation.goBack} />
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
  copy: {
    marginTop: spacing.xl,
  },
  footer: {
    marginTop: 'auto',
    paddingBottom: spacing.xl,
    gap: spacing.md,
    alignItems: 'center',
  },
});
