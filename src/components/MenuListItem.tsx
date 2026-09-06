import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Body } from './Typography';
import { colors, spacing, touchTarget } from '../theme/tokens';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  destructive?: boolean;
};

export default function MenuListItem({ icon, label, onPress, destructive }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <View style={styles.left}>
        <Ionicons name={icon} size={20} color={destructive ? colors.error.text : colors.neutralDark} />
        <Body style={destructive ? styles.destructiveLabel : undefined}>{label}</Body>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.neutralMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: touchTarget.minimum,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.white,
  },
  rowPressed: {
    backgroundColor: colors.accent,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  destructiveLabel: {
    color: colors.error.text,
  },
});
