import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts, fontSizes, radius, spacing, touchTarget } from '../theme/tokens';

type Props = {
  label: string;
  selected?: boolean;
  onPress: () => void;
};

export default function Chip({ label, selected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: Boolean(selected) }}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: touchTarget.minimum - 8,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.accent,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.bodyDefault,
    color: colors.neutralDark,
  },
  labelSelected: {
    color: colors.white,
    fontFamily: fonts.bodySemiBold,
  },
});
