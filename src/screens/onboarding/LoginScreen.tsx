import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/types';
import ScreenContainer from '../../components/ScreenContainer';
import BackButton from '../../components/BackButton';
import { Heading, Body } from '../../components/Typography';
import PillTextInput from '../../components/PillTextInput';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryLink from '../../components/SecondaryLink';
import { spacing } from '../../theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation, route }: Props) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const showBackButton = route.params.entryPoint === 'carousel';

  // Returning here from OTP Verification's back icon clears the entered number, per spec.
  useFocusEffect(
    useCallback(() => {
      setPhoneNumber('');
    }, []),
  );

  const handleSendOtp = () => {
    navigation.navigate('OtpVerification', { phoneNumber, from: 'login' });
  };

  return (
    <ScreenContainer>
      <View style={styles.topRow}>{showBackButton && <BackButton onPress={navigation.goBack} />}</View>

      <View style={styles.content}>
        <Heading>Login</Heading>
        <Body style={styles.label}>Enter your registered mobile number.</Body>
        <PillTextInput
          style={styles.input}
          placeholder="Mobile number"
          keyboardType="number-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          maxLength={10}
          autoFocus
        />
      </View>

      <View style={styles.footer}>
        <PrimaryButton label="Send OTP" onPress={handleSendOtp} disabled={phoneNumber.length < 10} />
        <SecondaryLink label="New here? Sign up." onPress={() => navigation.navigate('Signup')} />
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
    gap: spacing.lg,
  },
  label: {
    marginBottom: spacing.sm,
  },
  input: {
    marginTop: spacing.sm,
  },
  footer: {
    gap: spacing.lg,
    alignItems: 'center',
    paddingBottom: spacing.xl,
  },
});
