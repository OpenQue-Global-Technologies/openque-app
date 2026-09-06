import React from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import Card from './Card';
import { Body, Caption } from './Typography';
import { colors, spacing } from '../theme/tokens';

type Props = {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export default function ToggleRow({ label, description, value, onValueChange }: Props) {
  return (
    <Card style={styles.row}>
      <View style={styles.textColumn}>
        <Body>{label}</Body>
        {description && <Caption style={styles.description}>{description}</Caption>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.accent, true: colors.primary }}
        thumbColor={colors.white}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  textColumn: {
    flex: 1,
    gap: 2,
  },
  description: {
    color: colors.neutralMuted,
  },
});
