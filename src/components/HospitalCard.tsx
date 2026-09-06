import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from './Card';
import PrimaryButton from './PrimaryButton';
import { Body, Caption, SubHeading } from './Typography';
import type { Hospital } from '../data/mockData';
import { colors, radius, spacing } from '../theme/tokens';

type Props = {
  hospital: Hospital;
  onPress: () => void;
  onBookNow: () => void;
  style?: ViewStyle;
};

export default function HospitalCard({ hospital, onPress, onBookNow, style }: Props) {
  return (
    <Card onPress={onPress} style={StyleSheet.flatten([styles.card, style])}>
      <View style={styles.thumbnail}>
        <Ionicons name="business" size={32} color={colors.primary} />
      </View>
      <SubHeading style={styles.name} numberOfLines={1}>
        {hospital.name}
      </SubHeading>
      <Caption>{hospital.address}</Caption>
      <View style={styles.metaRow}>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={14} color={colors.delayed.text} />
          <Caption style={styles.metaText}>{hospital.rating.toFixed(1)}</Caption>
        </View>
        <Caption style={styles.metaText}>{hospital.distanceKm.toFixed(1)} km</Caption>
      </View>
      <PrimaryButton label="Book now" onPress={onBookNow} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 240,
    gap: spacing.xs,
  },
  thumbnail: {
    width: '100%',
    height: 96,
    borderRadius: radius.medium,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  name: {
    fontSize: 16,
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: colors.neutralMuted,
  },
});
