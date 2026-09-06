import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BookingsStackParamList } from '../../navigation/types';
import ScreenContainer from '../../components/ScreenContainer';
import BackButton from '../../components/BackButton';
import Card from '../../components/Card';
import PrimaryButton from '../../components/PrimaryButton';
import DevPanel from '../../components/DevPanel';
import { Body, Caption, Heading } from '../../components/Typography';
import { getDoctorById, getSlotsForDoctorOnDate } from '../../data/mockData';
import { rescheduleBooking } from '../../state/bookingsStore';
import { colors, radius, spacing } from '../../theme/tokens';

type Props = NativeStackScreenProps<BookingsStackParamList, 'Waitlist'>;

type WaitlistPhase = 'JOINING' | 'WAITING' | 'NOTIFIED' | 'EXPIRED';

const CLAIM_WINDOW_SECONDS = 15 * 60;

function addDays(dateKey: string, days: number): string {
  const date = new Date(dateKey);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function WaitlistScreen({ navigation, route }: Props) {
  const { bookingId, doctorId } = route.params;
  const doctor = getDoctorById(doctorId);
  const [phase, setPhase] = useState<WaitlistPhase>('JOINING');
  const [wantsIvrCall, setWantsIvrCall] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(CLAIM_WINDOW_SECONDS);
  const [ivrLogVisible, setIvrLogVisible] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const freedDate = addDays(new Date().toISOString().slice(0, 10), 1);
  const freedSlots = getSlotsForDoctorOnDate(doctorId, freedDate);
  const freedTime = freedSlots.Morning[0] ?? freedSlots.Afternoon[0] ?? freedSlots.Evening[0] ?? '09:00 AM';

  useEffect(() => {
    if (phase !== 'NOTIFIED') {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setPhase('EXPIRED');
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [phase]);

  const handleJoinWaitlist = () => {
    setPhase('WAITING');
  };

  const handleSimulateSlotFreed = () => {
    setSecondsLeft(CLAIM_WINDOW_SECONDS);
    setPhase('NOTIFIED');
    setIvrLogVisible(wantsIvrCall);
  };

  const handleSimulateAlmostExpired = () => {
    setSecondsLeft(10);
  };

  const handleBackToWaiting = () => {
    setPhase('WAITING');
    setIvrLogVisible(false);
  };

  const handleClaim = async () => {
    setIsClaiming(true);
    await rescheduleBooking(bookingId, { date: freedDate, time: freedTime });
    setIsClaiming(false);
    navigation.navigate('RescheduleRequiredConfirmed', { bookingId, date: freedDate, time: freedTime });
  };

  return (
    <ScreenContainer>
      <View style={styles.topRow}>
        <BackButton onPress={navigation.goBack} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Heading>We&apos;ll notify you the moment an earlier slot opens.</Heading>
        <Body style={styles.body}>
          Waitlisted for {doctor?.name ?? 'this doctor'}. We&apos;ll reach out the instant a slot frees up.
        </Body>

        <Card style={styles.ivrRow}>
          <View style={styles.ivrText}>
            <Body>Or would you like us to call you?</Body>
            <Caption style={styles.ivrDescription}>
              An automated call (not a manual staff callback) fires the moment a slot opens: "A slot has
              opened for {doctor?.name ?? '[Name]'}. Press 1 to confirm, Press 2 to pass."
            </Caption>
          </View>
          <Switch
            value={wantsIvrCall}
            onValueChange={setWantsIvrCall}
            trackColor={{ false: colors.accent, true: colors.primary }}
            thumbColor={colors.white}
            disabled={phase !== 'JOINING'}
          />
        </Card>

        {phase === 'JOINING' && (
          <PrimaryButton label="Join waitlist" onPress={handleJoinWaitlist} />
        )}

        {phase === 'WAITING' && (
          <View style={styles.waitingBlock}>
            <Ionicons name="hourglass-outline" size={32} color={colors.neutralMuted} />
            <Caption style={styles.waitingText}>
              You're on the waitlist. This screen updates automatically — no need to keep checking.
            </Caption>
          </View>
        )}

        {(phase === 'NOTIFIED' || phase === 'EXPIRED') && (
          <View style={styles.notifiedBlock}>
            {phase === 'NOTIFIED' ? (
              <>
                <Caption style={styles.notifiedHeading}>
                  A slot just opened — {freedTime} tomorrow. Claim it within:
                </Caption>
                <Heading style={styles.countdown}>{formatCountdown(secondsLeft)}</Heading>
                {ivrLogVisible && (
                  <Caption style={styles.ivrLog}>
                    [IVR] Automated call placed (mocked — no real call sent): "A slot has opened for{' '}
                    {doctor?.name ?? '[Name]'}. Press 1 to confirm, Press 2 to pass."
                  </Caption>
                )}
                <PrimaryButton label="Claim slot" onPress={handleClaim} loading={isClaiming} />
              </>
            ) : (
              <Caption style={styles.expiredText}>
                That offer expired — we'll let you know when the next slot opens.
              </Caption>
            )}
          </View>
        )}

        <DevPanel
          title="waitlist simulation (Module K)"
          actions={[
            {
              label: 'Simulate: Slot freed now',
              enabled: phase === 'WAITING',
              onPress: handleSimulateSlotFreed,
            },
            {
              label: 'Simulate: Claim window almost expired',
              enabled: phase === 'NOTIFIED',
              onPress: handleSimulateAlmostExpired,
            },
            {
              label: 'Back to waiting',
              enabled: phase === 'EXPIRED',
              onPress: handleBackToWaiting,
            },
          ]}
        />
      </ScrollView>
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
    paddingBottom: spacing.xxxl,
  },
  body: {
    color: colors.neutralMuted,
  },
  ivrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  ivrText: {
    flex: 1,
    gap: spacing.xs,
  },
  ivrDescription: {
    color: colors.neutralMuted,
  },
  waitingBlock: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xl,
  },
  waitingText: {
    textAlign: 'center',
    color: colors.neutralMuted,
  },
  notifiedBlock: {
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.waiting.bg,
    borderRadius: radius.medium,
    padding: spacing.lg,
  },
  notifiedHeading: {
    textAlign: 'center',
    color: colors.waiting.text,
  },
  countdown: {
    fontSize: 32,
    color: colors.waiting.text,
  },
  ivrLog: {
    textAlign: 'center',
    color: colors.waiting.text,
  },
  expiredText: {
    textAlign: 'center',
    color: colors.neutralMuted,
  },
});
