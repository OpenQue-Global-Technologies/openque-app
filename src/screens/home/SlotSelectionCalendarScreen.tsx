import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import BackButton from '../../components/BackButton';
import PrimaryButton from '../../components/PrimaryButton';
import { Body, Caption, SubHeading } from '../../components/Typography';
import { getDoctorById, getHospitalById } from '../../data/mockData';
import { colors, radius, spacing } from '../../theme/tokens';

/**
 * Navigator-agnostic — both the Home stack (fresh booking) and the Bookings
 * stack (patient-initiated reschedule, Section 6.2) render this same
 * component and supply their own navigation wiring via these callbacks,
 * rather than each stack shipping its own copy of the slot-picker UI.
 */
type Props = {
  doctorId: string;
  onBack: () => void;
  onContinue: (dateKey: string) => void;
};

const DAYS_AHEAD = 14;

function buildDateOptions() {
  const options = [];
  for (let i = 0; i < DAYS_AHEAD; i += 1) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    options.push({
      key: date.toISOString().slice(0, 10),
      weekday: date.toLocaleDateString(undefined, { weekday: 'short' }),
      day: date.getDate(),
      month: date.toLocaleDateString(undefined, { month: 'short' }),
    });
  }
  return options;
}

export default function SlotSelectionCalendarScreen({ doctorId, onBack, onContinue }: Props) {
  const doctor = getDoctorById(doctorId);
  const hospital = doctor ? getHospitalById(doctor.hospitalId) : undefined;
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const dateOptions = buildDateOptions();

  if (!doctor || !hospital) {
    return (
      <ScreenContainer centered>
        <Body>Doctor not found.</Body>
      </ScreenContainer>
    );
  }

  const handleContinue = () => {
    if (!selectedDateKey) return;
    onContinue(selectedDateKey);
  };

  return (
    <ScreenContainer>
      <View style={styles.topRow}>
        <BackButton onPress={onBack} />
      </View>

      <View style={styles.header}>
        <SubHeading>{doctor.name}</SubHeading>
        <Caption>{hospital.name}</Caption>
      </View>

      <FlatList
        data={dateOptions}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        contentContainerStyle={styles.dateStrip}
        renderItem={({ item }) => {
          const isSelected = item.key === selectedDateKey;
          return (
            <Pressable
              style={[styles.dateCard, isSelected && styles.dateCardSelected]}
              onPress={() => setSelectedDateKey(item.key)}
            >
              <Caption style={isSelected ? styles.dateTextSelected : undefined}>{item.weekday}</Caption>
              <Body style={isSelected ? styles.dateTextSelected : styles.dateNumber}>{item.day}</Body>
              <Caption style={isSelected ? styles.dateTextSelected : undefined}>{item.month}</Caption>
            </Pressable>
          );
        }}
      />

      <View style={styles.footer}>
        <PrimaryButton label="Continue" onPress={handleContinue} disabled={!selectedDateKey} />
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
    marginBottom: spacing.xl,
  },
  dateStrip: {
    gap: spacing.sm,
  },
  dateCard: {
    width: 64,
    height: 80,
    borderRadius: radius.medium,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  dateCardSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dateNumber: {
    fontSize: 18,
  },
  dateTextSelected: {
    color: colors.white,
  },
  footer: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    marginTop: 'auto',
  },
});
