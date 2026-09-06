import React, { useRef } from 'react';
import { NativeSyntheticEvent, StyleSheet, TextInput, TextInputKeyPressEventData, View } from 'react-native';
import { colors, fonts, fontSizes, radius, spacing } from '../theme/tokens';

const OTP_LENGTH = 6;

type Props = {
  value: string[];
  onChange: (value: string[]) => void;
  hasError?: boolean;
};

export default function OtpInput({ value, onChange, hasError }: Props) {
  const inputRefs = useRef<Array<TextInput | null>>([]);

  const handleChangeText = (text: string, index: number) => {
    const digit = text.replace(/[^0-9]/g, '').slice(-1);
    const next = [...value];
    next[index] = digit;
    onChange(next);

    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number,
  ) => {
    if (event.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.row}>
      {Array.from({ length: OTP_LENGTH }).map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            inputRefs.current[index] = ref;
          }}
          value={value[index] ?? ''}
          onChangeText={(text) => handleChangeText(text, index)}
          onKeyPress={(event) => handleKeyPress(event, index)}
          keyboardType="number-pad"
          maxLength={1}
          textContentType="oneTimeCode"
          autoComplete={index === 0 ? 'sms-otp' : 'off'}
          accessibilityLabel={`OTP digit ${index + 1}`}
          style={[styles.box, hasError && styles.boxError]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  box: {
    flex: 1,
    height: 52,
    borderWidth: 1.5,
    borderColor: colors.neutralMuted,
    borderRadius: radius.medium,
    backgroundColor: colors.white,
    textAlign: 'center',
    fontFamily: fonts.bodySemiBold,
    fontSize: fontSizes.h2,
    color: colors.neutralDark,
  },
  boxError: {
    borderColor: colors.delayed.text,
    backgroundColor: colors.delayed.bg,
  },
});
