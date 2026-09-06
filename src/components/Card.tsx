import React, { ReactNode } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../theme/tokens';

type Props = {
  children: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
};

export default function Card({ children, onPress, style }: Props) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed, style]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.large,
    padding: spacing.lg,
  },
  cardPressed: {
    backgroundColor: colors.accent,
  },
});
