import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from './Card';
import { Body, Caption, SubHeading } from './Typography';
import type { Doctor } from '../data/mockData';
import { colors, radius, spacing } from '../theme/tokens';

type Props = {
  doctor: Doctor;
  onPress: () => void;
};

export default function DoctorCard({ doctor, onPress }: Props) {
  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.avatar}>
        <Ionicons name="person" size={28} color={colors.primary} />
      </View>

      <View style={styles.info}>
        <SubHeading style={styles.name}>{doctor.name}</SubHeading>
        <Caption>
          {doctor.specialty} · {doctor.yearsExperience} yrs exp.
        </Caption>
        <Body style={styles.fee}>₹{doctor.feeInr} consultation fee</Body>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 16,
  },
  fee: {
    fontSize: 14,
    color: colors.neutralDark,
    marginTop: 2,
  },
});
