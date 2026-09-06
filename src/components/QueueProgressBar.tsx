import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Caption } from './Typography';
import type { QueueState } from '../state/queueStore';
import { colors, spacing } from '../theme/tokens';

type StageStatus = 'done' | 'active' | 'upcoming';
type StageKey = 'arrived' | 'consultation' | 'testscan' | 'consultation2' | 'completed';

type Stage = { key: StageKey; label: string };

/**
 * Section 6.2: "Dynamic progress bar — stages appear only once generated:
 * Arrived → Consultation → [Test/Scan if referred] → Consultation →
 * Completed." The Test/Scan + second Consultation nodes only render once
 * `wasReferred` is true for this booking.
 */
function buildStages(wasReferred: boolean): Stage[] {
  const stages: Stage[] = [
    { key: 'arrived', label: 'Arrived' },
    { key: 'consultation', label: 'Consultation' },
  ];
  if (wasReferred) {
    stages.push({ key: 'testscan', label: 'Test/Scan' });
    stages.push({ key: 'consultation2', label: 'Consultation' });
  }
  stages.push({ key: 'completed', label: 'Completed' });
  return stages;
}

function getStageStatus(key: StageKey, state: QueueState, wasReferred: boolean): StageStatus {
  switch (key) {
    case 'arrived':
      return state === 'BOOKED' ? 'upcoming' : 'done';
    case 'consultation':
      // Once referred, the first consultation is necessarily already behind
      // us — referral only happens FROM IN_CONSULTATION (Section 9.1).
      if (wasReferred) return 'done';
      if (state === 'CALLED' || state === 'IN_CONSULTATION') return 'active';
      if (state === 'COMPLETED') return 'done';
      return 'upcoming';
    case 'testscan':
      return state === 'REFERRED' ? 'active' : 'done';
    case 'consultation2':
      if (state === 'CALLED' || state === 'IN_CONSULTATION') return 'active';
      if (state === 'COMPLETED') return 'done';
      return 'upcoming'; // REFERRED or RETURNING — not back in consultation yet
    case 'completed':
      return state === 'COMPLETED' ? 'done' : 'upcoming';
    default:
      return 'upcoming';
  }
}

type Props = {
  state: QueueState;
  wasReferred: boolean;
};

export default function QueueProgressBar({ state, wasReferred }: Props) {
  const stages = buildStages(wasReferred);

  return (
    <View style={styles.row}>
      {stages.map((stage, index) => {
        const status = getStageStatus(stage.key, state, wasReferred);
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
            {index < stages.length - 1 && (
              <View
                style={[
                  styles.connector,
                  getStageStatus(stages[index + 1].key, state, wasReferred) !== 'upcoming' &&
                    styles.connectorDone,
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
