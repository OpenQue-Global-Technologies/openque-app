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
};

export default function PrimaryButton({ label, onPress, disabled, loading }: Props) {
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
        isDisabled && styles.buttonDisabled,
        pressed && !isDisabled && styles.buttonPressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={styles.label}>{label}</Text>
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
  buttonDisabled: {
    backgroundColor: colors.neutralMuted,
    opacity: 0.5,
  },
  label: {
    color: colors.white,
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.bodyLarge,
  },
});
