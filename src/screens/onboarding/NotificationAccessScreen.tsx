import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import type { RootStackParamList } from '../../navigation/types';
import ScreenContainer from '../../components/ScreenContainer';
import { Heading, Body } from '../../components/Typography';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryLink from '../../components/SecondaryLink';
import { colors, spacing } from '../../theme/tokens';
import {
  declineNotificationPermission,
  getStoredNotificationStatus,
  requestNotificationPermission,
} from '../../state/notificationPermission';

type Props = NativeStackScreenProps<RootStackParamList, 'NotificationAccess'>;

export default function NotificationAccessScreen({ navigation }: Props) {
  const [isChecking, setIsChecking] = useState(true);
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    let isActive = true;
    getStoredNotificationStatus().then((status) => {
      if (!isActive) return;
      if (status === 'denied') {
        // The OS (or, for this mock, a prior "Maybe Later") already remembers a
        // decline, so show the re-prompt screen instead of asking again.
        navigation.replace('NotificationPreviouslyDenied');
      } else {
        setIsChecking(false);
      }
    });
    return () => {
      isActive = false;
    };
  }, [navigation]);

  const handleAllow = async () => {
    setIsRequesting(true);
    await requestNotificationPermission();
    setIsRequesting(false);
    navigation.navigate('ProfileDetails');
  };

  const handleMaybeLater = async () => {
    await declineNotificationPermission();
    navigation.navigate('ProfileDetails');
  };

  if (isChecking) {
    return <ScreenContainer centered>{null}</ScreenContainer>;
  }

  return (
    <ScreenContainer centered>
      <View style={styles.iconCircle}>
        <Ionicons name="notifications" size={56} color={colors.primary} />
      </View>
      <Heading style={styles.heading}>Stay updated</Heading>
      <Body style={styles.body}>
        Enable notifications to be kept updated on your queue and appointments.
      </Body>

      <View style={styles.actions}>
        <PrimaryButton label="Allow Notification" onPress={handleAllow} loading={isRequesting} />
        <SecondaryLink label="Maybe Later" onPress={handleMaybeLater} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  heading: {
    textAlign: 'center',
  },
  body: {
    textAlign: 'center',
    color: colors.neutralMuted,
    marginTop: spacing.sm,
  },
  actions: {
    width: '100%',
    gap: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.xxxl,
  },
});
