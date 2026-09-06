import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '../theme/tokens';

type Props = {
  count: number;
  activeIndex: number;
};

export default function PaginationDots({ count, activeIndex }: Props) {
  return (
    <View style={styles.row}>
      {Array.from({ length: count }).map((_, index) => (
        <View
          key={index}
          style={[styles.dot, index === activeIndex && styles.dotActive]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 20,
  },
});
