import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts, fontSizes, radius, touchTarget } from '../theme/tokens';

type Props = {
  options: string[];
  value: string | null;
  onChange: (value: string) => void;
};

export default function SegmentedControl({ options, value, onChange }: Props) {
  return (
    <View style={styles.track}>
      {options.map((option) => {
        const isActive = option === value;
        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            accessibilityRole="radio"
            accessibilityState={{ selected: isActive }}
            style={[styles.segment, isActive && styles.segmentActive]}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>{option}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.neutralMuted,
    padding: 4,
  },
  segment: {
    flex: 1,
    minHeight: touchTarget.minimum - 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
  segmentActive: {
    backgroundColor: colors.primary,
  },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: fontSizes.bodyDefault,
    color: colors.neutralDark,
  },
  labelActive: {
    color: colors.white,
    fontFamily: fonts.bodySemiBold,
  },
});
