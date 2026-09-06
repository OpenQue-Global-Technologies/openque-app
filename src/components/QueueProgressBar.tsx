import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Caption } from './Typography';
import type { QueueState } from '../state/queueStore';
import { colors, spacing } from '../theme/tokens';

type StageStatus = 'done' | 'active' | 'upcoming';

const STAGES: { key: string; label: string }[] = [
  { key: 'arrived', label: 'Arrived' },
  { key: 'consultation', label: 'Consultation' },
  { key: 'completed', label: 'Completed' },
];

function getStageStatus(stageKey: string, state: QueueState): StageStatus {
  if (stageKey === 'arrived') {
    return state === 'BOOKED' ? 'upcoming' : 'done';
  }
  if (stageKey === 'consultation') {
    if (state === 'CALLED' || state === 'IN_CONSULTATION') return 'active';
    if (state === 'COMPLETED') return 'done';
    return 'upcoming';
  }
  // completed
  return state === 'COMPLETED' ? 'done' : 'upcoming';
}

type Props = {
  state: QueueState;
};

export default function QueueProgressBar({ state }: Props) {
  return (
    <View style={styles.row}>
      {STAGES.map((stage, index) => {
        const status = getStageStatus(stage.key, state);
        return (
          <React.Fragment key={stage.key}>
            <View style={styles.stage}>
              <View
                style={[
                  styles.node,
                  status === 'done' && styles.nodeDone,
                  status === 'active' && styles.nodeActive,
                ]}
              >
                {status === 'done' ? (
                  <Ionicons name="checkmark" size={16} color={colors.white} />
                ) : (
                  <View style={status === 'active' ? styles.dotActive : styles.dotUpcoming} />
                )}
              </View>
              <Caption style={status === 'upcoming' ? styles.labelUpcoming : styles.label}>
                {stage.label}
              </Caption>
            </View>
            {index < STAGES.length - 1 && (
              <View
                style={[
                  styles.connector,
                  getStageStatus(STAGES[index + 1].key, state) !== 'upcoming' && styles.connectorDone,
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stage: {
    alignItems: 'center',
    gap: spacing.xs,
    width: 72,
  },
  node: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeDone: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  nodeActive: {
    borderColor: colors.primary,
  },
  dotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  dotUpcoming: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
  },
  label: {
    color: colors.neutralDark,
    textAlign: 'center',
  },
  labelUpcoming: {
    color: colors.neutralMuted,
    textAlign: 'center',
  },
  connector: {
    flex: 1,
    height: 2,
    backgroundColor: colors.accent,
    marginTop: 13,
  },
  connectorDone: {
    backgroundColor: colors.primary,
  },
});
