import React from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';
import { colors, fonts, fontSizes, radius, spacing, touchTarget } from '../theme/tokens';

type Props = {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  /** White-on-primary variant for use on a Primary/Secondary gradient background. */
  inverted?: boolean;
};

export default function PrimaryButton({ label, onPress, disabled, loading, inverted }: Props) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled }}
      style={({ pressed }) => [
        styles.button,
        inverted && styles.buttonInverted,
        isDisabled && styles.buttonDisabled,
        pressed && !isDisabled && !inverted && styles.buttonPressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={inverted ? colors.primary : colors.white} />
      ) : (
        <Text style={[styles.label, inverted && styles.labelInverted]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: touchTarget.minimum,
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.md,
  },
  buttonPressed: {
    backgroundColor: colors.secondary,
  },
  buttonInverted: {
    backgroundColor: colors.white,
  },
  buttonDisabled: {
    backgroundColor: colors.neutralMuted,
    opacity: 0.5,
  },
  label: {
    color: colors.white,
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.bodyLarge,
  },
  labelInverted: {
    color: colors.primary,
  },
});
