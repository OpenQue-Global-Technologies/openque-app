import React, { useState } from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import type { HomeStackParamList } from '../../navigation/types';
import ScreenContainer from '../../components/ScreenContainer';
import BackButton from '../../components/BackButton';
import DoctorCard from '../../components/DoctorCard';
import SecondaryLink from '../../components/SecondaryLink';
import { Body, Caption, Heading, SubHeading } from '../../components/Typography';
import { getDoctorsByHospital, getHospitalById } from '../../data/mockData';
import { colors, radius, spacing } from '../../theme/tokens';

type Props = NativeStackScreenProps<HomeStackParamList, 'HospitalProfile'>;

export default function HospitalProfileScreen({ navigation, route }: Props) {
  const [isAboutExpanded, setAboutExpanded] = useState(false);
  const hospital = getHospitalById(route.params.hospitalId);
  const doctors = getDoctorsByHospital(route.params.hospitalId);

  if (!hospital) {
    return (
      <ScreenContainer centered>
        <Body>Hospital not found.</Body>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer style={styles.noHorizontalPadding}>
      <View style={styles.topRow}>
        <BackButton onPress={navigation.goBack} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Ionicons name="business" size={56} color={colors.primary} />
        </View>

        <Heading>{hospital.name}</Heading>
        <Body style={styles.address}>{hospital.address}</Body>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="star" size={16} color={colors.delayed.text} />
            <Caption style={styles.metaText}>{hospital.rating.toFixed(1)}</Caption>
          </View>
          <Caption style={styles.metaText}>{hospital.distanceKm.toFixed(1)} km away</Caption>
        </View>

        <View style={styles.quickActions}>
          <SecondaryLink label="Call" onPress={() => Linking.openURL('tel:+911234567890')} />
          <SecondaryLink
            label="Directions"
            onPress={() =>
              Linking.openURL(
                `https://maps.google.com/?q=${encodeURIComponent(hospital.address)}`,
              )
            }
          />
        </View>

        <View style={styles.chipWrap}>
          {hospital.specialties.map((specialty) => (
            <View key={specialty} style={styles.readOnlyChip}>
              <Caption style={styles.readOnlyChipText}>{specialty}</Caption>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <SubHeading>Doctors</SubHeading>
          <View style={styles.doctorList}>
            {doctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onPress={() => navigation.navigate('DoctorProfile', { doctorId: doctor.id })}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <SubHeading>About</SubHeading>
          <Body numberOfLines={isAboutExpanded ? undefined : 2}>{hospital.about}</Body>
          <SecondaryLink
            label={isAboutExpanded ? 'Show less' : 'Read more'}
            onPress={() => setAboutExpanded((current) => !current)}
          />
        </View>
      </ScrollView>
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
    gap: spacing.sm,
    paddingBottom: spacing.xxxl,
  },
  hero: {
    height: 160,
    borderRadius: radius.large,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  address: {
    color: colors.neutralMuted,
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: colors.neutralMuted,
  },
  quickActions: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginTop: spacing.sm,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  readOnlyChip: {
    minHeight: 28,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
  },
  readOnlyChipText: {
    color: colors.neutralDark,
  },
  section: {
    gap: spacing.md,
    marginTop: spacing.xxl,
  },
  doctorList: {
    gap: spacing.md,
  },
});
