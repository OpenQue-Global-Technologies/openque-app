import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from './Card';
import { Body, Caption, SubHeading } from './Typography';
import type { Hospital, HospitalSearchMeta } from '../data/mockData';
import { colors, radius, spacing } from '../theme/tokens';

type Props = {
  hospital: Hospital;
  meta: HospitalSearchMeta;
  onPress: () => void;
};

export default function SearchResultCard({ hospital, meta, onPress }: Props) {
  return (
    <Card onPress={onPress} style={styles.card}>
      <View style={styles.thumbnail}>
        <Ionicons name="business" size={28} color={colors.primary} />
      </View>

      <View style={styles.info}>
        <SubHeading style={styles.name} numberOfLines={1}>
          {hospital.name}
        </SubHeading>
        <Caption>{meta.matchedSpecialtyLabel}</Caption>
        <View style={styles.metaRow}>
          <Caption style={styles.metaText}>{hospital.distanceKm.toFixed(1)} km</Caption>
          <Caption style={styles.metaText}>₹{meta.startingFeeInr} onwards</Caption>
        </View>
        <View style={styles.slotBadge}>
          <Body style={styles.slotBadgeText}>{meta.nextSlotLabel}</Body>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  thumbnail: {
    width: 72,
    height: 72,
    borderRadius: radius.medium,
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
  metaRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: 2,
  },
  metaText: {
    color: colors.neutralMuted,
  },
  slotBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.success.bg,
    borderRadius: radius.small,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginTop: spacing.xs,
  },
  slotBadgeText: {
    fontSize: 12,
    color: colors.success.text,
  },
});
