import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { BookingsStackParamList, MainTabParamList } from '../../navigation/types';
import ScreenContainer from '../../components/ScreenContainer';
import BackButton from '../../components/BackButton';
import Card from '../../components/Card';
import PrimaryButton from '../../components/PrimaryButton';
import StatusTag from '../../components/StatusTag';
import DevPanel from '../../components/DevPanel';
import { Body, Caption, Heading } from '../../components/Typography';
import { getDoctorById, getHospitalById } from '../../data/mockData';
import {
  computeStatusTag,
  getBookingById,
  isBookingUpcoming,
  type Booking,
  type BookingStatusTag,
} from '../../state/bookingsStore';
import { getQueueState, type QueueState } from '../../state/queueStore';
import { getPushTokenState, setPushTokenState, type PushTokenState } from '../../state/pushTokenStore';
import { colors, radius, spacing } from '../../theme/tokens';

type Props = CompositeScreenProps<
  NativeStackScreenProps<BookingsStackParamList, 'AppointmentDetail'>,
  BottomTabScreenProps<MainTabParamList>
>;

export default function AppointmentDetailScreen({ navigation, route }: Props) {
  const [booking, setBooking] = useState<Booking | null | undefined>(undefined);
  const [queueState, setQueueStateLocal] = useState<QueueState>('BOOKED');
  const [pushTokenState, setPushTokenStateLocal] = useState<PushTokenState>(getPushTokenState());

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      getBookingById(route.params.bookingId).then(async (result) => {
        if (!isActive) return;
        setBooking(result);
        if (result) {
          const state = await getQueueState(result.id);
          if (isActive) setQueueStateLocal(state);
        }
      });
      return () => {
        isActive = false;
      };
    }, [route.params.bookingId]),
  );

  if (booking === undefined) {
    return <ScreenContainer centered>{null}</ScreenContainer>;
  }

  if (!booking) {
    return (
      <ScreenContainer centered>
        <Body>Booking not found.</Body>
      </ScreenContainer>
    );
  }

  const doctor = getDoctorById(booking.doctorId);
  const hospital = getHospitalById(booking.hospitalId);
  const tag: BookingStatusTag = computeStatusTag(booking, queueState);
  const upcoming = isBookingUpcoming(booking, queueState);
  const actionsEnabled = upcoming && queueState === 'BOOKED';
  const formattedDate = new Date(booking.date).toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const handleReschedule = () => {
    navigation.navigate('RescheduleCalendar', { bookingId: booking.id, doctorId: booking.doctorId });
  };

  const handleCancel = () => {
    navigation.navigate('CancelConfirmation', { bookingId: booking.id });
  };

  const handleBookAgain = () => {
    navigation.navigate('HomeTab', { screen: 'DoctorProfile', params: { doctorId: booking.doctorId } });
  };

  const handleSetPushTokenState = (state: PushTokenState) => {
    setPushTokenState(state);
    setPushTokenStateLocal(state);
  };

  const handleSimulateDisruption = (scenario: 'DELAYED_TODAY' | 'UNAVAILABLE', forceExhausted?: boolean) => {
    navigation.navigate('RescheduleRequired', { bookingId: booking.id, scenario, forceExhausted });
  };

  return (
    <ScreenContainer>
      <View style={styles.topRow}>
        <BackButton onPress={navigation.goBack} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headingRow}>
          <Heading style={styles.heading}>Appointment Detail</Heading>
          <StatusTag tag={tag} />
        </View>

        <Card style={styles.recapCard}>
          <Body style={styles.doctorName}>{doctor?.name}</Body>
          <Caption>{doctor?.specialty}</Caption>
          <Caption>{hospital?.name}</Caption>
          <View style={styles.divider} />
          <Caption>{formattedDate}</Caption>
          <Caption>{booking.time}</Caption>
          <View style={styles.divider} />
          <Caption>Consultation fee: ₹{booking.feeInr}</Caption>
          <Caption>Pay at hospital — Cash.</Caption>
        </Card>

        {upcoming && (
          <Caption style={styles.policyNote}>
            Free rescheduling and cancellation up to 2 hours before your appointment.
          </Caption>
        )}

        {upcoming && !actionsEnabled && (
          <Caption style={styles.lockedNote}>
            You're checked in for this visit, so it can no longer be rescheduled or cancelled here — track
            it from the Queue tab, or ask the front desk if you need a change.
          </Caption>
        )}

        {actionsEnabled && (
          <DevPanel title="Module D — doctor unavailability simulation">
            <Caption style={styles.devSubLabel}>
              Push token (item 39): {pushTokenState} — set before triggering, to see each fallback path.
            </Caption>
            <View style={styles.devTokenRow}>
              {(['VALID', 'MISSING', 'UNREGISTERED'] as PushTokenState[]).map((option) => (
                <Pressable
                  key={option}
                  onPress={() => handleSetPushTokenState(option)}
                  style={[styles.devTokenButton, pushTokenState === option && styles.devTokenButtonActive]}
                >
                  <Caption
                    style={[
                      styles.devTokenButtonLabel,
                      pushTokenState === option && styles.devTokenButtonLabelActive,
                    ]}
                  >
                    {option}
                  </Caption>
                </Pressable>
              ))}
            </View>
            <View style={styles.devTokenRow}>
              <Pressable
                onPress={() => handleSimulateDisruption('DELAYED_TODAY')}
                style={styles.devTriggerButton}
              >
                <Caption style={styles.devTriggerLabel}>Simulate: Doctor delayed today</Caption>
              </Pressable>
              <Pressable onPress={() => handleSimulateDisruption('UNAVAILABLE')} style={styles.devTriggerButton}>
                <Caption style={styles.devTriggerLabel}>Simulate: Doctor unavailable</Caption>
              </Pressable>
              <Pressable
                onPress={() => handleSimulateDisruption('UNAVAILABLE', true)}
                style={styles.devTriggerButton}
              >
                <Caption style={styles.devTriggerLabel}>Simulate: Unavailable, no alternatives</Caption>
              </Pressable>
            </View>
          </DevPanel>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {upcoming ? (
          <View style={styles.actionRow}>
            <Pressable
              onPress={handleReschedule}
              disabled={!actionsEnabled}
              style={[styles.outlineButton, !actionsEnabled && styles.buttonDisabled]}
            >
              <Body style={[styles.outlineButtonLabel, !actionsEnabled && styles.disabledLabel]}>
                Reschedule
              </Body>
            </Pressable>
            <Pressable
              onPress={handleCancel}
              disabled={!actionsEnabled}
              style={[styles.outlineButton, !actionsEnabled && styles.buttonDisabled]}
            >
              <Body style={[styles.outlineButtonLabel, !actionsEnabled && styles.disabledLabel]}>Cancel</Body>
            </Pressable>
          </View>
        ) : (
          <PrimaryButton label="Book again" onPress={handleBookAgain} />
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topRow: {
    minHeight: 44,
    justifyContent: 'center',
  },
  scrollContent: {
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  heading: {
    fontSize: 22,
  },
  recapCard: {
    gap: 2,
  },
  doctorName: {
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: colors.background,
    marginVertical: spacing.sm,
  },
  policyNote: {
    color: colors.neutralMuted,
  },
  lockedNote: {
    color: colors.delayed.text,
    backgroundColor: colors.delayed.bg,
    padding: spacing.md,
    borderRadius: radius.medium,
  },
  footer: {
    paddingVertical: spacing.lg,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  outlineButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  outlineButtonLabel: {
    color: colors.primary,
    fontWeight: '600',
  },
  buttonDisabled: {
    borderColor: colors.neutralMuted,
    opacity: 0.5,
  },
  disabledLabel: {
    color: colors.neutralMuted,
  },
  devSubLabel: {
    color: colors.delayed.text,
  },
  devTokenRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  devTokenButton: {
    minHeight: 28,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.delayed.text,
    backgroundColor: colors.white,
  },
  devTokenButtonActive: {
    backgroundColor: colors.delayed.text,
  },
  devTokenButtonLabel: {
    color: colors.delayed.text,
    fontWeight: '600',
  },
  devTokenButtonLabelActive: {
    color: colors.white,
  },
  devTriggerButton: {
    minHeight: 28,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.delayed.text,
    backgroundColor: colors.white,
  },
  devTriggerLabel: {
    color: colors.delayed.text,
    fontWeight: '600',
  },
});
