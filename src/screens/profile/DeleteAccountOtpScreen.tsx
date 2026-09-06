import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '../../navigation/types';
import ScreenContainer from '../../components/ScreenContainer';
import BackButton from '../../components/BackButton';
import { Heading, Body, Caption } from '../../components/Typography';
import OtpInput from '../../components/OtpInput';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryLink from '../../components/SecondaryLink';
import { colors, spacing } from '../../theme/tokens';
import { isOtpCorrect } from '../../state/otp';
import { getUserProfile } from '../../state/userProfileStore';

type Props = NativeStackScreenProps<ProfileStackParamList, 'DeleteAccountOtp'>;

const RESEND_TIMER_SECONDS = 30;

/**
 * Decided v6 — Section 17.3 item 24: OTP re-verify, not typed confirmation,
 * gates account deletion. Reuses Phase 1's OtpInput component/validation
 * logic rather than a separate confirmation-typing UI.
 */
export default function DeleteAccountOtpScreen({ navigation }: Props) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [digits, setDigits] = useState<string[]>([]);
  const [hasError, setHasError] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_TIMER_SECONDS);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      getUserProfile().then((profile) => {
        if (isActive) setPhoneNumber(profile.phoneNumber);
      });
      return () => {
        isActive = false;
      };
    }, []),
  );

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
      navigation.navigate('DeleteAccountConfirmation');
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
        <Heading>Verify it's you</Heading>
        <Body style={styles.body}>
          Enter the 6-digit code sent to +91-{phoneNumber || 'XXXXXXXXXX'} to confirm account deletion.
        </Body>

        <OtpInput value={digits} onChange={handleChange} hasError={hasError} />

        {hasError && <Caption style={styles.errorMessage}>Incorrect OTP. Please try again.</Caption>}

        <View style={styles.resendRow}>
          {secondsLeft > 0 ? (
            <Caption>Resend OTP in 00:{secondsLeft.toString().padStart(2, '0')}</Caption>
          ) : (
            <SecondaryLink label="Resend OTP" onPress={handleResend} />
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton label="Verify & delete" onPress={handleVerify} disabled={!isComplete} />
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
