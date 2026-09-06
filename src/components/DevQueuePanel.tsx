import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Caption } from './Typography';
import type { QueueState } from '../state/queueStore';
import { colors, radius, spacing, touchTarget } from '../theme/tokens';

type Props = {
  state: QueueState;
  onMarkArrived: () => void;
  onCallPatient: () => void;
  onCompleteVisit: () => void;
  onMarkNoShow: () => void;
  onReset: () => void;
};

type DevAction = {
  label: string;
  enabled: boolean;
  onPress: () => void;
};

/**
 * DEV ONLY — simulates hospital staff actions (receptionist marking arrival,
 * doctor calling the patient, doctor completing the visit). There is no
 * OpenQue AIR yet to drive these transitions for real; this panel stands in
 * for it and should be deleted once that exists. Intentionally styled off
 * the product's design tokens so it reads as scaffolding, not real UI.
 */
export default function DevQueuePanel({
  state,
  onMarkArrived,
  onCallPatient,
  onCompleteVisit,
  onMarkNoShow,
  onReset,
}: Props) {
  const actions: DevAction[] = [
    { label: 'Mark Arrived → WAITING', enabled: state === 'BOOKED', onPress: onMarkArrived },
    { label: 'Call Patient → CALLED', enabled: state === 'WAITING', onPress: onCallPatient },
    { label: 'Complete Visit → COMPLETED', enabled: state === 'IN_CONSULTATION', onPress: onCompleteVisit },
    { label: 'Mark No-Show → NO_SHOW', enabled: state === 'WAITING', onPress: onMarkNoShow },
    { label: 'Reset demo → BOOKED', enabled: state !== 'BOOKED', onPress: onReset },
  ];

  return (
    <View style={styles.panel}>
      <Caption style={styles.title}>⚠ DEV ONLY — simulates hospital staff actions</Caption>
      <Caption style={styles.stateLabel}>Current state: {state}</Caption>
      <View style={styles.buttonRow}>
        {actions.map((action) => (
          <Pressable
            key={action.label}
            onPress={action.onPress}
            disabled={!action.enabled}
            style={[styles.button, !action.enabled && styles.buttonDisabled]}
          >
            <Caption style={[styles.buttonLabel, !action.enabled && styles.buttonLabelDisabled]}>
              {action.label}
            </Caption>
          </Pressable>
        ))}
      </View>
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
  stateLabel: {
    color: colors.delayed.text,
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
