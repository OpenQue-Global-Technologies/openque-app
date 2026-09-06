import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import type { RootStackParamList } from '../../navigation/types';
import ScreenContainer from '../../components/ScreenContainer';
import { Heading } from '../../components/Typography';
import { colors, spacing } from '../../theme/tokens';
import { updateUserProfile } from '../../state/userProfileStore';

type Props = NativeStackScreenProps<RootStackParamList, 'OtpVerified'>;

const AUTO_ADVANCE_MS = 1500;

export default function OtpVerifiedScreen({ navigation, route }: Props) {
  useEffect(() => {
    updateUserProfile({ phoneNumber: route.params.phoneNumber });
    const timer = setTimeout(() => {
      navigation.replace('LocationAccess');
    }, AUTO_ADVANCE_MS);
    return () => clearTimeout(timer);
  }, [navigation, route.params.phoneNumber]);

  return (
    <ScreenContainer centered>
      <View style={styles.iconCircle}>
        <Ionicons name="checkmark" size={56} color={colors.success.text} />
      </View>
      <Heading style={styles.heading}>OTP Verified Successfully</Heading>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.success.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  heading: {
    textAlign: 'center',
  },
});
