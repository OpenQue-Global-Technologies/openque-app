import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '../../navigation/types';
import ScreenContainer from '../../components/ScreenContainer';
import BackButton from '../../components/BackButton';
import PillTextInput from '../../components/PillTextInput';
import PrimaryButton from '../../components/PrimaryButton';
import { Body, Heading } from '../../components/Typography';
import { spacing } from '../../theme/tokens';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ChangePhoneNumber'>;

export default function ChangePhoneNumberScreen({ navigation }: Props) {
  const [newPhoneNumber, setNewPhoneNumber] = useState('');

  const handleSendOtp = () => {
    navigation.navigate('ChangePhoneOtp', { newPhoneNumber });
  };

  return (
    <ScreenContainer>
      <View style={styles.topRow}>
        <BackButton onPress={navigation.goBack} />
      </View>

      <View style={styles.content}>
        <Heading>Change phone number</Heading>
        <Body style={styles.label}>
          Enter your new mobile number. We'll send an OTP to verify it's really you.
        </Body>
        <PillTextInput
          style={styles.input}
          placeholder="New mobile number"
          keyboardType="number-pad"
          value={newPhoneNumber}
          onChangeText={setNewPhoneNumber}
          maxLength={10}
          autoFocus
        />
      </View>

      <View style={styles.footer}>
        <PrimaryButton label="Send OTP" onPress={handleSendOtp} disabled={newPhoneNumber.length < 10} />
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
    paddingBottom: spacing.xl,
  },
});
