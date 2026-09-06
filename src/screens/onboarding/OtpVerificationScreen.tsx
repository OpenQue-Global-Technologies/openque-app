import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import ScreenContainer from '../../components/ScreenContainer';
import BackButton from '../../components/BackButton';
import { Heading, Body, Caption } from '../../components/Typography';
import OtpInput from '../../components/OtpInput';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryLink from '../../components/SecondaryLink';
import { colors, spacing } from '../../theme/tokens';
import { isOtpCorrect } from '../../state/otp';

type Props = NativeStackScreenProps<RootStackParamList, 'OtpVerification'>;

const RESEND_TIMER_SECONDS = 30;

export default function OtpVerificationScreen({ navigation, route }: Props) {
  const { phoneNumber } = route.params;
  const [digits, setDigits] = useState<string[]>([]);
  const [hasError, setHasError] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_TIMER_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  const code = digits.join('');
  const isComplete = code.length === 6;

  const handleChange = (next: string[]) => {
    setDigits(next);
    if (hasError) setHasError(false);
  };

  const handleVerify = () => {
    if (isOtpCorrect(code)) {
      navigation.navigate('OtpVerified', { phoneNumber });
    } else {
      setHasError(true);
    }
  };

  const handleResend = () => {
    setSecondsLeft(RESEND_TIMER_SECONDS);
    setDigits([]);
    setHasError(false);
  };

  return (
    <ScreenContainer>
      <View style={styles.topRow}>
        <BackButton onPress={navigation.goBack} />
      </View>

      <View style={styles.content}>
        <Heading>OTP Verification</Heading>
        <Body style={styles.body}>
          Enter the 6-digit code sent to +91-{phoneNumber || 'XXXXXXXXXX'}.
        </Body>

        <OtpInput value={digits} onChange={handleChange} hasError={hasError} />

        {hasError && (
          <Caption style={styles.errorMessage}>Incorrect OTP. Please try again.</Caption>
        )}

        <View style={styles.resendRow}>
          {secondsLeft > 0 ? (
            <Caption>Resend OTP in 00:{secondsLeft.toString().padStart(2, '0')}</Caption>
          ) : (
            <SecondaryLink label="Resend OTP" onPress={handleResend} />
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton label="Verify OTP" onPress={handleVerify} disabled={!isComplete} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topRow: {
    minHeight: 44,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.xl,
  },
  body: {
    color: colors.neutralMuted,
  },
  errorMessage: {
    color: colors.delayed.text,
  },
  resendRow: {
    alignItems: 'center',
  },
  footer: {
    paddingBottom: spacing.xl,
  },
});
