import React, { type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Caption } from './Typography';
import { colors, radius, spacing, touchTarget } from '../theme/tokens';

type DevAction = {
  label: string;
  enabled?: boolean;
  onPress: () => void;
};

type Props = {
  title: string;
  actions?: DevAction[];
  children?: ReactNode;
};

/**
 * DEV ONLY — shared shell for simulating hospital-staff/system actions that
 * have no real backend yet (see DevQueuePanel, the original instance of this
 * pattern from Phase 3). Intentionally styled off the product's design
 * tokens so it always reads as scaffolding, never real UI.
 */
export default function DevPanel({ title, actions, children }: Props) {
  return (
    <View style={styles.panel}>
      <Caption style={styles.title}>⚠ DEV ONLY — {title}</Caption>
      {actions && actions.length > 0 && (
        <View style={styles.buttonRow}>
          {actions.map((action) => {
            const enabled = action.enabled ?? true;
            return (
              <Pressable
                key={action.label}
                onPress={action.onPress}
                disabled={!enabled}
                style={[styles.button, !enabled && styles.buttonDisabled]}
              >
                <Caption style={[styles.buttonLabel, !enabled && styles.buttonLabelDisabled]}>
                  {action.label}
                </Caption>
              </Pressable>
            );
          })}
        </View>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.delayed.text,
    backgroundColor: colors.delayed.bg,
    borderRadius: radius.medium,
    padding: spacing.md,
    gap: spacing.sm,
  },
  title: {
    color: colors.delayed.text,
    fontWeight: '700',
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  button: {
    minHeight: touchTarget.minimum - 8,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    borderRadius: radius.small,
    borderWidth: 1,
    borderColor: colors.delayed.text,
    backgroundColor: colors.white,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonLabel: {
    color: colors.delayed.text,
    fontWeight: '600',
  },
  buttonLabelDisabled: {
    color: colors.neutralMuted,
  },
});
