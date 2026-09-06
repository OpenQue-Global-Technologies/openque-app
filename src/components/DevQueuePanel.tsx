import React from 'react';
import { StyleSheet, View } from 'react-native';
import DevPanel from './DevPanel';
import { Caption } from './Typography';
import type { QueueState } from '../state/queueStore';
import { colors, spacing } from '../theme/tokens';

type Props = {
  state: QueueState;
  isRunningBehind: boolean;
  onMarkArrived: () => void;
  onCallPatient: () => void;
  onCompleteVisit: () => void;
  onMarkNoShow: () => void;
  onRefer: () => void;
  onTestComplete: () => void;
  onToggleRunningBehind: () => void;
  onSimulateQueueShift: () => void;
  onSimulateConnectionLost: () => void;
  onReset: () => void;
};

/**
 * DEV ONLY — simulates hospital staff actions (receptionist marking arrival,
 * doctor calling/referring/completing) and a few system-level situational
 * triggers (running behind, a queue-position shift, a dropped connection).
 * There is no OpenQue AIR yet to drive these transitions for real; this
 * panel stands in for it and should be deleted once that exists.
 */
export default function DevQueuePanel({
  state,
  isRunningBehind,
  onMarkArrived,
  onCallPatient,
  onCompleteVisit,
  onMarkNoShow,
  onRefer,
  onTestComplete,
  onToggleRunningBehind,
  onSimulateQueueShift,
  onSimulateConnectionLost,
  onReset,
}: Props) {
  return (
    <DevPanel
      title="simulates hospital staff actions"
      actions={[
        { label: 'Mark Arrived → WAITING', enabled: state === 'BOOKED', onPress: onMarkArrived },
        { label: 'Call Patient → CALLED', enabled: state === 'WAITING', onPress: onCallPatient },
        {
          label: 'Complete Visit → COMPLETED',
          enabled: state === 'IN_CONSULTATION',
          onPress: onCompleteVisit,
        },
        { label: 'Mark No-Show → NO_SHOW', enabled: state === 'WAITING', onPress: onMarkNoShow },
        { label: 'Refer for Test/Scan → REFERRED', enabled: state === 'IN_CONSULTATION', onPress: onRefer },
        { label: 'Test Complete → RETURNING', enabled: state === 'REFERRED', onPress: onTestComplete },
        { label: 'Call Returning Patient → CALLED', enabled: state === 'RETURNING', onPress: onCallPatient },
        { label: 'Reset demo → BOOKED', enabled: state !== 'BOOKED', onPress: onReset },
      ]}
    >
      <View style={styles.divider} />
      <Caption style={styles.sectionLabel}>Situational triggers</Caption>
      <View style={styles.buttonRow}>
        <DevToggleButton
          label={isRunningBehind ? 'Doctor running behind: ON' : 'Simulate: Doctor running behind'}
          active={isRunningBehind}
          onPress={onToggleRunningBehind}
        />
        <DevToggleButton
          label="Simulate: Queue position shift"
          onPress={onSimulateQueueShift}
          enabled={state === 'WAITING' || state === 'RETURNING'}
        />
        <DevToggleButton label="Simulate: Connection lost" onPress={onSimulateConnectionLost} />
      </View>
    </DevPanel>
  );
}

function DevToggleButton({
  label,
  onPress,
  active,
  enabled = true,
}: {
  label: string;
  onPress: () => void;
  active?: boolean;
  enabled?: boolean;
}) {
  return (
    <Caption
      onPress={enabled ? onPress : undefined}
      style={[
        styles.toggleButton,
        active && styles.toggleButtonActive,
        !enabled && styles.toggleButtonDisabled,
      ]}
    >
      {label}
    </Caption>
  );
}

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: colors.delayed.text,
    opacity: 0.3,
    marginVertical: spacing.xs,
  },
  sectionLabel: {
    color: colors.delayed.text,
    fontWeight: '700',
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  toggleButton: {
    minHeight: 28,
    paddingHorizontal: spacing.md,
    textAlignVertical: 'center',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.delayed.text,
    backgroundColor: colors.white,
    color: colors.delayed.text,
    fontWeight: '600',
    overflow: 'hidden',
    paddingVertical: spacing.xs,
  },
  toggleButtonActive: {
    backgroundColor: colors.delayed.text,
    color: colors.white,
  },
  toggleButtonDisabled: {
    opacity: 0.4,
  },
});
