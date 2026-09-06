import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Body } from './Typography';
import { colors, radius, spacing } from '../theme/tokens';

type Props = {
  visible: boolean;
};

/** Toast/chip overlay — "You've arrived ✓" — auto-dismissed by the caller after a few seconds. */
export default function ArrivalChip({ visible }: Props) {
  if (!visible) return null;

  return (
    <View style={styles.wrapper} pointerEvents="none">
      <View style={styles.chip}>
        <Ionicons name="checkmark-circle" size={18} color={colors.success.text} />
        <Body style={styles.text}>You&apos;ve arrived</Body>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: spacing.md,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.success.bg,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  text: {
    color: colors.success.text,
    fontSize: 14,
  },
});
