import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Caption } from './Typography';
import type { BookingStatusTag } from '../state/bookingsStore';
import { colors, radius, spacing } from '../theme/tokens';

type Props = {
  tag: BookingStatusTag;
};

const TAG_STYLES: Record<BookingStatusTag, { bg: string; text: string }> = {
  Confirmed: colors.success,
  Rescheduled: colors.waiting,
  Completed: colors.success,
  Cancelled: colors.cancelled,
  'No-show': colors.error,
};

export default function StatusTag({ tag }: Props) {
  const style = TAG_STYLES[tag];
  return (
    <View style={[styles.pill, { backgroundColor: style.bg }]}>
      <Caption style={[styles.label, { color: style.text }]}>{tag}</Caption>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    borderRadius: radius.small,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  label: {
    fontSize: 12,
  },
});
