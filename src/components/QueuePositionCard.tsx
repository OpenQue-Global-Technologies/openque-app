import React from 'react';
import { StyleSheet } from 'react-native';
import Card from './Card';
import { Body, Caption } from './Typography';
import { spacing } from '../theme/tokens';

type Props = {
  doctorName: string;
  statusText: string;
  onPress: () => void;
};

export default function QueuePositionCard({ doctorName, statusText, onPress }: Props) {
  return (
    <Card onPress={onPress} style={styles.card}>
      <Body>{doctorName}</Body>
      <Caption>{statusText}</Caption>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.xs,
  },
});
