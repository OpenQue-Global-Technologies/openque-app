import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Caption } from './Typography';
import { colors, spacing } from '../theme/tokens';

type Props = {
  visible: boolean;
};

/**
 * Module L (9.13) — Real-Time Connection Fallback. A thin, non-blocking
 * banner: it occupies its own strip at the top of the screen and never
 * covers or disables the rest of the UI underneath.
 */
export default function ConnectionBanner({ visible }: Props) {
  if (!visible) return null;

  return (
    <View style={styles.banner}>
      <ActivityIndicator size="small" color={colors.delayed.text} />
      <Caption style={styles.text}>Reconnecting…</Caption>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.delayed.bg,
    paddingVertical: spacing.xs,
  },
  text: {
    color: colors.delayed.text,
    fontWeight: '600',
  },
});
