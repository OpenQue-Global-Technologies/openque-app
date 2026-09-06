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
import Toast from '../../components/Toast';
import ConnectionBanner from '../../components/ConnectionBanner';
import DevQueuePanel from '../../components/DevQueuePanel';
import { Body, Caption, Heading, SubHeading } from '../../components/Typography';
import { getDoctorById, getHospitalById } from '../../data/mockData';
import { getUpcomingBooking, type Booking } from '../../state/bookingsStore';
import {
  bumpAheadCount,
  getPatientFacingStatus,
  getQueueRecord,
  RUNNING_BEHIND_STATUS_TEXT,
  setIsRunningBehind,
  setQueueState,
  type QueueState,
} from '../../state/queueStore';
import { colors, spacing } from '../../theme/tokens';

type Props = BottomTabScreenProps<MainTabParamList, 'QueueTab'>;

const CHIP_DURATION_MS = 3500;
const CONNECTION_LOST_DURATION_MS = 4000;

export default function QueueScreen({ navigation }: Props) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [queueState, setLocalQueueState] = useState<QueueState>('BOOKED');
  const [wasReferred, setWasReferred] = useState(false);
  const [isRunningBehindLocal, setIsRunningBehindLocal] = useState(false);
  const [aheadCount, setAheadCount] = useState(0);
  const [showArrivalChip, setShowArrivalChip] = useState(false);
  const [showReferredChip, setShowReferredChip] = useState(false);
  const [showReturningChip, setShowReturningChip] = useState(false);
  const [showQueueUpdatedChip, setShowQueueUpdatedChip] = useState(false);
  const [showConnectionBanner, setShowConnectionBanner] = useState(false);
  const [showCompletionPrompt, setShowCompletionPrompt] = useState(false);
  const [rating, setRating] = useState(0);
  const chipTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const connectionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      getUpcomingBooking().then(async (result) => {
        if (!isActive) return;
        setBooking(result);
        if (result) {
          const record = await getQueueRecord(result.id);
          if (!isActive) return;
          setLocalQueueState(record.state);
          setWasReferred(record.wasReferred);
          setIsRunningBehindLocal(record.isRunningBehind);
          setAheadCount(record.aheadCount);
        }
      });
      return () => {
        isActive = false;
      };
    }, []),
  );

  const showChip = (setter: (visible: boolean) => void) => {
    setter(true);
    if (chipTimerRef.current) clearTimeout(chipTimerRef.current);
    chipTimerRef.current = setTimeout(() => setter(false), CHIP_DURATION_MS);
  };

  const updateState = async (bookingId: string, next: QueueState) => {
    await setQueueState(bookingId, next);
    const record = await getQueueRecord(bookingId);
    setLocalQueueState(record.state);
    setWasReferred(record.wasReferred);
    setIsRunningBehindLocal(record.isRunningBehind);
    setAheadCount(record.aheadCount);
  };

  const handleMarkArrived = () => {
    if (!booking) return;
    updateState(booking.id, 'WAITING');
    showChip(setShowArrivalChip);
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

  const handleMarkNoShow = () => {
    if (!booking) return;
    updateState(booking.id, 'NO_SHOW');
  };

  const handleRefer = () => {
    if (!booking) return;
    updateState(booking.id, 'REFERRED');
    showChip(setShowReferredChip);
  };

  const handleTestComplete = () => {
    if (!booking) return;
    updateState(booking.id, 'RETURNING');
    showChip(setShowReturningChip);
  };

  const handleToggleRunningBehind = async () => {
    if (!booking) return;
    const next = !isRunningBehindLocal;
    await setIsRunningBehind(booking.id, next);
    setIsRunningBehindLocal(next);
  };

  const handleSimulateQueueShift = async () => {
    if (!booking) return;
    const next = await bumpAheadCount(booking.id);
    setAheadCount(next);
    showChip(setShowQueueUpdatedChip);
  };

  const handleSimulateConnectionLost = () => {
    setShowConnectionBanner(true);
    if (connectionTimerRef.current) clearTimeout(connectionTimerRef.current);
    connectionTimerRef.current = setTimeout(() => setShowConnectionBanner(false), CONNECTION_LOST_DURATION_MS);
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
      isRunningBehind={isRunningBehindLocal}
      onMarkArrived={handleMarkArrived}
      onCallPatient={handleCallPatient}
      onCompleteVisit={handleCompleteVisit}
      onMarkNoShow={handleMarkNoShow}
      onRefer={handleRefer}
      onTestComplete={handleTestComplete}
      onToggleRunningBehind={handleToggleRunningBehind}
      onSimulateQueueShift={handleSimulateQueueShift}
      onSimulateConnectionLost={handleSimulateConnectionLost}
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

  if (queueState === 'BOOKED' || queueState === 'COMPLETED' || queueState === 'NO_SHOW') {
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

  const statusText =
    isRunningBehindLocal && queueState === 'WAITING'
      ? RUNNING_BEHIND_STATUS_TEXT
      : getPatientFacingStatus(aheadCount, queueState);

  return (
    <ScreenContainer style={styles.noHorizontalPadding}>
      <ConnectionBanner visible={showConnectionBanner} />
      <View style={styles.horizontalPadding}>
        <ArrivalChip visible={showArrivalChip} />
        <Toast visible={showReferredChip} message="Please proceed to Radiology for your scan." />
        <Toast
          visible={showReturningChip}
          message={`You're back with ${doctor?.name ?? 'your doctor'} — estimated wait ~10 min.`}
        />
        <Toast
          visible={showQueueUpdatedChip}
          message={`Queue updated — ${aheadCount} people ahead of you now`}
        />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.trackerHeader}>
            <SubHeading>{doctor?.name}</SubHeading>
            <Caption>
              {hospital?.name} · {booking.time}
            </Caption>
          </View>

          <QueueProgressBar state={queueState} wasReferred={wasReferred} />

          <Body style={styles.statusText}>{statusText}</Body>

          {devPanel}
        </ScrollView>
      </View>

      <CalledInAlert
        visible={queueState === 'CALLED'}
        doctorName={doctor?.name ?? 'your doctor'}
        onDismiss={handleDismissCalledAlert}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  noHorizontalPadding: {
    paddingHorizontal: 0,
  },
  horizontalPadding: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
  },
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
