import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ScreenContainer from '../../components/ScreenContainer';
import BackButton from '../../components/BackButton';
import Chip from '../../components/Chip';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryLink from '../../components/SecondaryLink';
import Toast from '../../components/Toast';
import DevPanel from '../../components/DevPanel';
import { Body, Caption, Heading, SubHeading } from '../../components/Typography';
import { getDoctorById, getHospitalById, getSlotsForDoctorOnDate, type TimeOfDay } from '../../data/mockData';
import { colors, spacing } from '../../theme/tokens';
import { addSlotNotifyRequest, dispatchSlotsOpened } from '../../state/notifyRequestsStore';

/**
 * Navigator-agnostic — see SlotSelectionCalendarScreen's note. Shared by the
 * Home stack's fresh-booking flow and the Bookings stack's reschedule flow.
 */
type Props = {
  doctorId: string;
  date: string;
  onBack: () => void;
  onContinue: (time: string) => void;
  onChooseDifferentDoctor?: () => void;
};

const PERIODS: TimeOfDay[] = ['Morning', 'Afternoon', 'Evening'];
const TOAST_DURATION_MS = 2500;

export default function SlotSelectionTimeGridScreen({
  doctorId,
  date,
  onBack,
  onContinue,
  onChooseDifferentDoctor,
}: Props) {
  const doctor = getDoctorById(doctorId);
  const hospital = doctor ? getHospitalById(doctor.hospitalId) : undefined;
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [devForceNoSlots, setDevForceNoSlots] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!doctor || !hospital) {
    return (
      <ScreenContainer centered>
        <Body>Doctor not found.</Body>
      </ScreenContainer>
    );
  }

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), TOAST_DURATION_MS);
  };

  const realSlots = getSlotsForDoctorOnDate(doctorId, date);
  const slots = devForceNoSlots ? { Morning: [], Afternoon: [], Evening: [] } : realSlots;
  const hasAnySlots = slots.Morning.length + slots.Afternoon.length + slots.Evening.length > 0;
  const formattedDate = new Date(date).toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const handleContinue = () => {
    if (!selectedTime) return;
    onContinue(selectedTime);
  };

  const handleNotifyWhenSlotsOpen = () => {
    addSlotNotifyRequest({
      doctorId,
      hospitalId: hospital.id,
      targetDate: date,
      timePreference: 'Any',
    });
    showToast("We'll notify you the moment a slot opens up.");
  };

  const handleDevToggleNoSlots = () => {
    const next = !devForceNoSlots;
    setDevForceNoSlots(next);
    if (!next) {
      const notified = dispatchSlotsOpened(doctorId, date);
      if (notified.length > 0) {
        showToast(`Simulated dispatch: notified ${notified.length} pending request(s) that slots opened.`);
      }
    }
  };

  return (
    <ScreenContainer>
      <Toast visible={!!toastMessage} message={toastMessage ?? ''} />
      <View style={styles.topRow}>
        <BackButton onPress={onBack} />
      </View>

      <View style={styles.header}>
        <SubHeading>{doctor.name}</SubHeading>
        <Caption>
          {hospital.name} · {formattedDate}
        </Caption>
      </View>

      {!hasAnySlots ? (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={48} color={colors.neutralMuted} />
          <Heading style={styles.emptyHeading}>No slots available for the next 14 days.</Heading>
          <View style={styles.emptyActions}>
            <PrimaryButton label="Notify me when slots open" onPress={handleNotifyWhenSlotsOpen} />
            <SecondaryLink
              label="Choose a different doctor"
              onPress={onChooseDifferentDoctor ?? onBack}
            />
          </View>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {PERIODS.map((period) => (
            <View key={period} style={styles.section}>
              <Body style={styles.periodLabel}>{period}</Body>
              <View style={styles.grid}>
                {slots[period].map((time) => (
                  <Chip
                    key={time}
                    label={time}
                    selected={time === selectedTime}
                    onPress={() => setSelectedTime(time)}
                  />
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {hasAnySlots && (
        <View style={styles.footer}>
          <PrimaryButton label="Continue to booking" onPress={handleContinue} disabled={!selectedTime} />
        </View>
      )}

      <DevPanel
        title="slot availability simulation"
        actions={[
          {
            label: devForceNoSlots ? 'Restore real slots' : 'Simulate: No slots available',
            onPress: handleDevToggleNoSlots,
          },
        ]}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topRow: {
    minHeight: 44,
    justifyContent: 'center',
  },
  header: {
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  scrollContent: {
    gap: spacing.xl,
    paddingBottom: spacing.xl,
  },
  section: {
    gap: spacing.md,
  },
  periodLabel: {
    color: colors.neutralDark,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  footer: {
    paddingVertical: spacing.lg,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  emptyHeading: {
    textAlign: 'center',
    fontSize: 18,
  },
  emptyActions: {
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.lg,
    width: '100%',
  },
});
