import React from 'react';
import { GestureResponderEvent, Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts, fontSizes, touchTarget } from '../theme/tokens';

type Props = {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
};

export default function SecondaryLink({ label, onPress, disabled }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="link"
      accessibilityLabel={label}
      style={styles.wrapper}
      hitSlop={8}
    >
      <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    minHeight: touchTarget.minimum,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: colors.primary,
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.bodyDefault,
  },
  labelDisabled: {
    color: colors.neutralMuted,
  },
});
