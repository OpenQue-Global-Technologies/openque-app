import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import type { RootStackParamList } from '../../navigation/types';
import ScreenContainer from '../../components/ScreenContainer';
import { Heading } from '../../components/Typography';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryLink from '../../components/SecondaryLink';
import { colors, spacing } from '../../theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'NotificationPreviouslyDenied'>;

export default function NotificationPreviouslyDeniedScreen({ navigation }: Props) {
  const goToProfileDetails = () => navigation.navigate('ProfileDetails');

  const handleOpenSettings = async () => {
    await Linking.openSettings().catch(() => undefined);
    goToProfileDetails();
  };

  return (
    <ScreenContainer centered>
      <View style={styles.iconCircle}>
        <Ionicons name="notifications-off" size={56} color={colors.delayed.text} />
      </View>
      <Heading style={styles.heading}>Notifications are off</Heading>

      <View style={styles.actions}>
        <PrimaryButton label="Open Settings" onPress={handleOpenSettings} />
        <SecondaryLink label="Not now" onPress={goToProfileDetails} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.delayed.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  heading: {
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    gap: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.xxxl,
  },
});
