import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, touchTarget } from '../theme/tokens';

type Props = {
  onPress: () => void;
};

export default function BackButton({ onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      style={styles.button}
      hitSlop={8}
    >
      <Ionicons name="arrow-back" size={24} color={colors.neutralDark} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: touchTarget.minimum,
    height: touchTarget.minimum,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
