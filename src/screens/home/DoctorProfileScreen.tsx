import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import type { HomeStackParamList } from '../../navigation/types';
import ScreenContainer from '../../components/ScreenContainer';
import BackButton from '../../components/BackButton';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryLink from '../../components/SecondaryLink';
import { Body, Caption, Heading, SubHeading } from '../../components/Typography';
import { getDoctorById, getHospitalById, getSlotsForDoctorOnDate } from '../../data/mockData';
import { colors, radius, spacing } from '../../theme/tokens';

type Props = NativeStackScreenProps<HomeStackParamList, 'DoctorProfile'>;

function nextDaysPreview(doctorId: string, count: number) {
  const days = [];
  for (let i = 0; i < count; i += 1) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dateKey = date.toISOString().slice(0, 10);
    const slots = getSlotsForDoctorOnDate(doctorId, dateKey);
    const firstSlot = slots.Morning[0] ?? slots.Afternoon[0] ?? slots.Evening[0];
    days.push({
      label: date.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' }),
      firstSlot,
    });
  }
  return days;
}

export default function DoctorProfileScreen({ navigation, route }: Props) {
  const doctor = getDoctorById(route.params.doctorId);
  const hospital = doctor ? getHospitalById(doctor.hospitalId) : undefined;

  if (!doctor || !hospital) {
    return (
      <ScreenContainer centered>
        <Body>Doctor not found.</Body>
      </ScreenContainer>
    );
  }

  const preview = nextDaysPreview(doctor.id, 3);

  return (
    <ScreenContainer style={styles.noHorizontalPadding}>
      <View style={styles.topRow}>
        <BackButton onPress={navigation.goBack} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={48} color={colors.primary} />
        </View>

        <Heading style={styles.name}>{doctor.name}</Heading>
        <Body style={styles.qualifications}>
          {doctor.qualifications} · {doctor.specialty} · {doctor.yearsExperience} yrs experience
        </Body>

        <Body style={styles.fee}>₹{doctor.feeInr} consultation fee</Body>

        <SecondaryLink
          label={`${hospital.name}, ${hospital.address}`}
          onPress={() => navigation.navigate('HospitalProfile', { hospitalId: hospital.id })}
        />

        <View style={styles.section}>
          <SubHeading>Available slots</SubHeading>
          <View style={styles.previewRow}>
            {preview.map((day) => (
              <View key={day.label} style={styles.previewCard}>
                <Caption>{day.label}</Caption>
                <Body style={styles.previewSlot}>{day.firstSlot ?? '—'}</Body>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label="Book Appointment"
          onPress={() => navigation.navigate('SlotSelectionCalendar', { doctorId: doctor.id })}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  noHorizontalPadding: {
    paddingHorizontal: 0,
  },
  topRow: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  scrollContent: {
    paddingHorizontal: spacing.xxl,
    gap: spacing.xs,
    paddingBottom: spacing.xxxl,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  name: {
    textAlign: 'center',
  },
  qualifications: {
    textAlign: 'center',
    color: colors.neutralMuted,
  },
  fee: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: spacing.sm,
    color: colors.primary,
  },
  section: {
    gap: spacing.md,
    marginTop: spacing.xxl,
  },
  previewRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  previewCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: radius.medium,
    padding: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
  },
  previewSlot: {
    fontSize: 14,
  },
  footer: {
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.accent,
  },
});
