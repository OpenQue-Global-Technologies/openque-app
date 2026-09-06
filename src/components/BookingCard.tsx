import React from 'react';
import { StyleSheet, View } from 'react-native';
import Card from './Card';
import StatusTag from './StatusTag';
import { Body, Caption } from './Typography';
import type { Booking, BookingStatusTag } from '../state/bookingsStore';
import { getDoctorById, getHospitalById } from '../data/mockData';
import { spacing } from '../theme/tokens';

type Props = {
  booking: Booking;
  tag: BookingStatusTag;
  onPress: () => void;
};

export default function BookingCard({ booking, tag, onPress }: Props) {
  const doctor = getDoctorById(booking.doctorId);
  const hospital = getHospitalById(booking.hospitalId);
  const formattedDate = new Date(booking.date).toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.header}>
        <Body style={styles.doctorName} numberOfLines={1}>
          {doctor?.name ?? 'Doctor'}
        </Body>
        <StatusTag tag={tag} />
      </View>
      <Caption>{hospital?.name}</Caption>
      <Caption style={styles.dateTime}>
        {formattedDate} · {booking.time}
      </Caption>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  doctorName: {
    flex: 1,
    fontSize: 16,
  },
  dateTime: {
    marginTop: spacing.xs,
  },
});
