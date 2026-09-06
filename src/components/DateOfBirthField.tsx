import React, { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import PillTextInput from './PillTextInput';
import { colors, fonts, fontSizes, radius, spacing, touchTarget } from '../theme/tokens';

type Props = {
  value: Date | null;
  onChange: (date: Date | null) => void;
  onBlur?: () => void;
};

function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function parseDateInput(text: string): Date | null {
  const match = text.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) return null;
  const [, day, month, year] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return Number.isNaN(date.getTime()) ? null : date;
}

// @react-native-community/datetimepicker has no web implementation, so web
// falls back to a plain masked text field while native platforms get the
// real picker UI.
export default function DateOfBirthField({ value, onChange, onBlur }: Props) {
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [text, setText] = useState(value ? formatDate(value) : '');

  // `value` can arrive after mount (e.g. a screen that loads the profile
  // asynchronously) — sync the display text in that case. Guarded on `!text`
  // so this never clobbers an in-progress edit: while typing, `value` only
  // goes from null to non-null once `text` already equals the same
  // formatted string, so this condition is already false by then.
  useEffect(() => {
    if (value && !text) {
      setText(formatDate(value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (Platform.OS === 'web') {
    return (
      <PillTextInput
        placeholder="DD/MM/YYYY"
        value={text}
        onChangeText={(next) => {
          setText(next);
          onChange(parseDateInput(next));
        }}
        onBlur={onBlur}
        keyboardType="number-pad"
        maxLength={10}
      />
    );
  }

  return (
    <>
      <Pressable
        style={styles.pickerTrigger}
        onPress={() => setPickerVisible(true)}
        accessibilityRole="button"
        accessibilityLabel="Date of birth"
      >
        <Text style={value ? styles.valueText : styles.placeholderText}>
          {value ? formatDate(value) : 'DD/MM/YYYY'}
        </Text>
      </Pressable>
      {isPickerVisible && (
        <DateTimePicker
          value={value ?? new Date(2000, 0, 1)}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          maximumDate={new Date()}
          onChange={(_event, selectedDate) => {
            setPickerVisible(Platform.OS === 'ios');
            if (selectedDate) onChange(selectedDate);
            onBlur?.();
          }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  pickerTrigger: {
    minHeight: touchTarget.minimum,
    borderWidth: 1.5,
    borderColor: colors.neutralMuted,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
  },
  valueText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.bodyLarge,
    color: colors.neutralDark,
  },
  placeholderText: {
    fontFamily: fonts.body,
    fontSize: fontSizes.bodyLarge,
    color: colors.neutralMuted,
  },
});
