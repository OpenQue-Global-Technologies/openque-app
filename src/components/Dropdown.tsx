import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Body } from './Typography';
import { colors, radius, spacing, touchTarget } from '../theme/tokens';

type Props<T extends string> = {
  label: string;
  value: T;
  options: T[];
  onChange: (value: T) => void;
};

export default function Dropdown<T extends string>({ label, value, options, onChange }: Props<T>) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Pressable
        style={styles.trigger}
        onPress={() => setIsOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${value}`}
      >
        <Body style={styles.triggerText}>
          {label}: {value}
        </Body>
        <Ionicons name="chevron-down" size={16} color={colors.neutralDark} />
      </Pressable>

      <Modal visible={isOpen} transparent animationType="fade" onRequestClose={() => setIsOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setIsOpen(false)}>
          <View style={styles.menu}>
            {options.map((option) => (
              <Pressable
                key={option}
                style={styles.menuItem}
                onPress={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
              >
                <Body style={option === value ? styles.menuItemActiveText : undefined}>{option}</Body>
                {option === value && <Ionicons name="checkmark" size={18} color={colors.primary} />}
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minHeight: touchTarget.minimum - 8,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.accent,
    backgroundColor: colors.white,
  },
  triggerText: {
    fontSize: 14,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(31, 41, 55, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    backgroundColor: colors.white,
    borderRadius: radius.large,
    padding: spacing.sm,
    minWidth: 200,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: touchTarget.minimum,
    paddingHorizontal: spacing.md,
  },
  menuItemActiveText: {
    color: colors.primary,
    fontWeight: '600',
  },
});
