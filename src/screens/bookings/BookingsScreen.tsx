import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import type { BookingsStackParamList, MainTabParamList } from '../../navigation/types';
import ScreenContainer from '../../components/ScreenContainer';
import SegmentedControl from '../../components/SegmentedControl';
import BookingCard from '../../components/BookingCard';
import PrimaryButton from '../../components/PrimaryButton';
import { Body, Heading } from '../../components/Typography';
import {
  computeStatusTag,
  getPastBookings,
  getUpcomingBookings,
  type Booking,
} from '../../state/bookingsStore';
import { getQueueState } from '../../state/queueStore';
import { colors, spacing } from '../../theme/tokens';

type Props = CompositeScreenProps<
  NativeStackScreenProps<BookingsStackParamList, 'BookingsList'>,
  BottomTabScreenProps<MainTabParamList>
>;

type Tab = 'Upcoming' | 'Past';

type Row = { booking: Booking; tag: ReturnType<typeof computeStatusTag> };

async function toRows(bookings: Booking[]): Promise<Row[]> {
  return Promise.all(
    bookings.map(async (booking) => ({
      booking,
      tag: computeStatusTag(booking, await getQueueState(booking.id)),
    })),
  );
}

export default function BookingsScreen({ navigation, route }: Props) {
  const [tab, setTab] = useState<Tab>(route.params?.initialTab ?? 'Upcoming');
  const [upcomingRows, setUpcomingRows] = useState<Row[] | null>(null);
  const [pastRows, setPastRows] = useState<Row[] | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      Promise.all([getUpcomingBookings(), getPastBookings()]).then(async ([upcoming, past]) => {
        const [upcomingWithTags, pastWithTags] = await Promise.all([toRows(upcoming), toRows(past)]);
        if (!isActive) return;
        setUpcomingRows(upcomingWithTags);
        setPastRows(pastWithTags);
      });
      return () => {
        isActive = false;
      };
    }, []),
  );

  const goBookAppointment = () => {
    navigation.navigate('HomeTab', { screen: 'SearchResults', params: undefined });
  };

  const goToDetail = (bookingId: string) => {
    navigation.navigate('AppointmentDetail', { bookingId });
  };

  if (upcomingRows === null || pastRows === null) {
    return <ScreenContainer centered>{null}</ScreenContainer>;
  }

  const hasAnyBooking = upcomingRows.length > 0 || pastRows.length > 0;

  if (!hasAnyBooking) {
    return (
      <ScreenContainer centered>
        <Ionicons name="calendar-outline" size={48} color={colors.neutralMuted} />
        <Heading style={styles.emptyHeading}>You haven't booked an appointment yet.</Heading>
        <View style={styles.emptyCta}>
          <PrimaryButton label="Book your first appointment" onPress={goBookAppointment} />
        </View>
      </ScreenContainer>
    );
  }

  const activeRows = tab === 'Upcoming' ? upcomingRows : pastRows;

  return (
    <ScreenContainer>
      <Heading style={styles.heading}>Bookings</Heading>

      <SegmentedControl options={['Upcoming', 'Past']} value={tab} onChange={(value) => setTab(value as Tab)} />

      {tab === 'Upcoming' && upcomingRows.length === 0 ? (
        <View style={styles.tabEmptyState}>
          <Body style={styles.tabEmptyHeading}>No upcoming appointments.</Body>
          <PrimaryButton label="Book now" onPress={goBookAppointment} />
        </View>
      ) : tab === 'Past' && pastRows.length === 0 ? (
        <View style={styles.tabEmptyState}>
          <Body style={styles.tabEmptyHeading}>No past appointments yet.</Body>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {activeRows.map(({ booking, tag }) => (
            <BookingCard key={booking.id} booking={booking} tag={tag} onPress={() => goToDetail(booking.id)} />
          ))}
        </ScrollView>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heading: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  emptyHeading: {
    textAlign: 'center',
    fontSize: 20,
  },
  emptyCta: {
    marginTop: spacing.xl,
    width: '100%',
  },
  tabEmptyState: {
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.xxxl,
  },
  tabEmptyHeading: {
    color: colors.neutralMuted,
  },
  list: {
    gap: spacing.md,
    paddingBottom: spacing.xxxl,
  },
});
