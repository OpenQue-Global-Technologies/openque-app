import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '../../navigation/types';
import ScreenContainer from '../../components/ScreenContainer';
import BackButton from '../../components/BackButton';
import PrimaryButton from '../../components/PrimaryButton';
import { Body, Caption, Heading } from '../../components/Typography';
import { colors, radius, spacing } from '../../theme/tokens';

type Props = NativeStackScreenProps<ProfileStackParamList, 'DeleteAccount'>;

export default function DeleteAccountScreen({ navigation }: Props) {
  return (
    <ScreenContainer>
      <View style={styles.topRow}>
        <BackButton onPress={navigation.goBack} />
      </View>

      <Heading>Delete Account</Heading>

      <View style={styles.warningBlock}>
        <Ionicons name="warning-outline" size={22} color={colors.delayed.text} />
        <Body style={styles.warningText}>
          This will permanently delete your account and data, including booking history.
        </Body>
      </View>

      <Caption style={styles.graceNote}>
        Your account enters a 15-30 day grace period first, during which it can still be recovered. After
        that window, it's permanently and irreversibly erased — this delay exists to meet medical-record
        retention requirements, not to keep you around.
      </Caption>

      <View style={styles.footer}>
        <PrimaryButton
          label="Delete my account"
          onPress={() => navigation.navigate('DeleteAccountOtp')}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topRow: {
    minHeight: 44,
    justifyContent: 'center',
  },
  warningBlock: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.delayed.bg,
    borderRadius: radius.medium,
    padding: spacing.md,
    marginTop: spacing.xl,
  },
  warningText: {
    flex: 1,
    color: colors.delayed.text,
  },
  graceNote: {
    marginTop: spacing.lg,
    color: colors.neutralMuted,
  },
  footer: {
    marginTop: 'auto',
    paddingBottom: spacing.xl,
  },
});
