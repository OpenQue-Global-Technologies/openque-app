import React, { useCallback, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import type { MainTabParamList } from '../../navigation/types';
import ScreenContainer from '../../components/ScreenContainer';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryLink from '../../components/SecondaryLink';
import RatingStars from '../../components/RatingStars';
import QueueProgressBar from '../../components/QueueProgressBar';
import CalledInAlert from '../../components/CalledInAlert';
import ArrivalChip from '../../components/ArrivalChip';
import DevQueuePanel from '../../components/DevQueuePanel';
import { Body, Caption, Heading, SubHeading } from '../../components/Typography';
import { getDoctorById, getHospitalById } from '../../data/mockData';
import { getUpcomingBooking, type Booking } from '../../state/bookingsStore';
import {
  AHEAD_COUNT_DEMO,
  getPatientFacingStatus,
  getQueueState,
  setQueueState,
  type QueueState,
} from '../../state/queueStore';
import { colors, spacing } from '../../theme/tokens';

type Props = BottomTabScreenProps<MainTabParamList, 'QueueTab'>;

const ARRIVAL_CHIP_DURATION_MS = 3000;

export default function QueueScreen({ navigation }: Props) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [queueState, setLocalQueueState] = useState<QueueState>('BOOKED');
  const [showArrivalChip, setShowArrivalChip] = useState(false);
  const [showCompletionPrompt, setShowCompletionPrompt] = useState(false);
  const [rating, setRating] = useState(0);
  const arrivalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      getUpcomingBooking().then(async (result) => {
        if (!isActive) return;
        setBooking(result);
        if (result) {
          const state = await getQueueState(result.id);
          if (isActive) setLocalQueueState(state);
        }
      });
      return () => {
        isActive = false;
      };
    }, []),
  );

  const updateState = async (bookingId: string, next: QueueState) => {
    await setQueueState(bookingId, next);
    setLocalQueueState(next);
  };

  const handleMarkArrived = () => {
    if (!booking) return;
    updateState(booking.id, 'WAITING');
    setShowArrivalChip(true);
    if (arrivalTimerRef.current) clearTimeout(arrivalTimerRef.current);
    arrivalTimerRef.current = setTimeout(() => setShowArrivalChip(false), ARRIVAL_CHIP_DURATION_MS);
  };

  const handleCallPatient = () => {
    if (!booking) return;
    updateState(booking.id, 'CALLED');
  };

  const handleDismissCalledAlert = () => {
    if (!booking) return;
    updateState(booking.id, 'IN_CONSULTATION');
  };

  const handleCompleteVisit = () => {
    if (!booking) return;
    updateState(booking.id, 'COMPLETED');
    setShowCompletionPrompt(true);
  };

  const handleReset = () => {
    if (!booking) return;
    updateState(booking.id, 'BOOKED');
    setShowCompletionPrompt(false);
    setRating(0);
  };

  const finishCompletion = () => {
    setShowCompletionPrompt(false);
    setRating(0);
  };

  if (!booking) {
    return (
      <ScreenContainer centered>
        <Ionicons name="time-outline" size={48} color={colors.neutralMuted} />
        <Heading style={styles.centeredHeading}>No active queue right now</Heading>
        <Body style={styles.centeredBody}>
          Your queue status will appear here on the day of your appointment.
        </Body>
      </ScreenContainer>
    );
  }

  const doctor = getDoctorById(booking.doctorId);
  const hospital = getHospitalById(booking.hospitalId);

  const devPanel = (
    <DevQueuePanel
      state={queueState}
      onMarkArrived={handleMarkArrived}
      onCallPatient={handleCallPatient}
      onCompleteVisit={handleCompleteVisit}
      onReset={handleReset}
    />
  );

  if (queueState === 'COMPLETED' && showCompletionPrompt) {
    return (
      <ScreenContainer>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.completionBlock}>
            <View style={styles.iconCircle}>
              <Ionicons name="checkmark" size={48} color={colors.success.text} />
            </View>
            <Heading style={styles.centeredHeading}>Your consultation is complete.</Heading>
            <RatingStars value={rating} onChange={setRating} />
            <View style={styles.completionActions}>
              <PrimaryButton label="Submit" onPress={finishCompletion} disabled={rating === 0} />
              <SecondaryLink label="Skip" onPress={finishCompletion} />
            </View>
          </View>
          {devPanel}
        </ScrollView>
      </ScreenContainer>
    );
  }

  if (queueState === 'BOOKED' || queueState === 'COMPLETED') {
    return (
      <ScreenContainer>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.centeredBlock}>
            <Ionicons name="time-outline" size={48} color={colors.neutralMuted} />
            <Heading style={styles.centeredHeading}>No active queue right now</Heading>
            <Body style={styles.centeredBody}>
              Your queue status will appear here on the day of your appointment.
            </Body>
            <PrimaryButton
              label="View upcoming appointments"
              onPress={() => navigation.navigate('BookingsTab')}
            />
          </View>
          {devPanel}
        </ScrollView>
      </ScreenContainer>
    );
  }

  const statusText = getPatientFacingStatus(AHEAD_COUNT_DEMO, queueState);

  return (
    <ScreenContainer>
      <ArrivalChip visible={showArrivalChip} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.trackerHeader}>
          <SubHeading>{doctor?.name}</SubHeading>
          <Caption>
            {hospital?.name} · {booking.time}
          </Caption>
        </View>

        <QueueProgressBar state={queueState} />

        <Body style={styles.statusText}>{statusText}</Body>

        {devPanel}
      </ScrollView>

      <CalledInAlert
        visible={queueState === 'CALLED'}
        doctorName={doctor?.name ?? 'your doctor'}
        onDismiss={handleDismissCalledAlert}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    gap: spacing.xxl,
    paddingBottom: spacing.xxxl,
  },
  centeredBlock: {
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xxxl,
  },
  centeredHeading: {
    textAlign: 'center',
    fontSize: 20,
  },
  centeredBody: {
    textAlign: 'center',
    color: colors.neutralMuted,
  },
  trackerHeader: {
    gap: spacing.xs,
  },
  statusText: {
    color: colors.neutralDark,
  },
  completionBlock: {
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.xxl,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.success.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completionActions: {
    alignItems: 'center',
    gap: spacing.md,
    width: '100%',
  },
});
