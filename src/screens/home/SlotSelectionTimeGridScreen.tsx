import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import BackButton from '../../components/BackButton';
import Chip from '../../components/Chip';
import PrimaryButton from '../../components/PrimaryButton';
import { Body, Caption, SubHeading } from '../../components/Typography';
import { getDoctorById, getHospitalById, getSlotsForDoctorOnDate, type TimeOfDay } from '../../data/mockData';
import { colors, spacing } from '../../theme/tokens';

/**
 * Navigator-agnostic — see SlotSelectionCalendarScreen's note. Shared by the
 * Home stack's fresh-booking flow and the Bookings stack's reschedule flow.
 */
type Props = {
  doctorId: string;
  date: string;
  onBack: () => void;
  onContinue: (time: string) => void;
};

const PERIODS: TimeOfDay[] = ['Morning', 'Afternoon', 'Evening'];

export default function SlotSelectionTimeGridScreen({ doctorId, date, onBack, onContinue }: Props) {
  const doctor = getDoctorById(doctorId);
  const hospital = doctor ? getHospitalById(doctor.hospitalId) : undefined;
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  if (!doctor || !hospital) {
    return (
      <ScreenContainer centered>
        <Body>Doctor not found.</Body>
      </ScreenContainer>
    );
  }

  const slots = getSlotsForDoctorOnDate(doctorId, date);
  const formattedDate = new Date(date).toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const handleContinue = () => {
    if (!selectedTime) return;
    onContinue(selectedTime);
  };

  return (
    <ScreenContainer>
      <View style={styles.topRow}>
        <BackButton onPress={onBack} />
      </View>

      <View style={styles.header}>
        <SubHeading>{doctor.name}</SubHeading>
        <Caption>
          {hospital.name} · {formattedDate}
        </Caption>
      </View>

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

      <View style={styles.footer}>
        <PrimaryButton label="Continue to booking" onPress={handleContinue} disabled={!selectedTime} />
      </View>
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
});
