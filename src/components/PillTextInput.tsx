import React, { useState } from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { colors, fonts, fontSizes, radius, spacing, touchTarget } from '../theme/tokens';
import { StyleSheet } from 'react-native';

export default function PillTextInput({ onFocus, onBlur, style, ...props }: TextInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus: TextInputProps['onFocus'] = (event) => {
    setIsFocused(true);
    onFocus?.(event);
  };

  const handleBlur: TextInputProps['onBlur'] = (event) => {
    setIsFocused(false);
    onBlur?.(event);
  };

  return (
    <TextInput
      placeholderTextColor={colors.neutralMuted}
      selectionColor={colors.primary}
      onFocus={handleFocus}
      onBlur={handleBlur}
      style={[styles.input, isFocused && styles.inputFocused, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: touchTarget.minimum,
    borderWidth: 1.5,
    borderColor: colors.neutralMuted,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.xl,
    fontFamily: fonts.body,
    fontSize: fontSizes.bodyLarge,
    color: colors.neutralDark,
  },
  inputFocused: {
    borderColor: colors.primary,
  },
});
