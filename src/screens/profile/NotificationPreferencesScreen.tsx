import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '../../navigation/types';
import ScreenContainer from '../../components/ScreenContainer';
import BackButton from '../../components/BackButton';
import ToggleRow from '../../components/ToggleRow';
import { Caption, Heading } from '../../components/Typography';
import {
  getNotificationPreferences,
  updateNotificationPreferences,
  type NotificationPreferences,
} from '../../state/notificationPreferencesStore';
import { colors, radius, spacing } from '../../theme/tokens';

type Props = NativeStackScreenProps<ProfileStackParamList, 'NotificationPreferences'>;

const DEFAULT_STATE: NotificationPreferences = { push: true, sms: true, whatsapp: true };

export default function NotificationPreferencesScreen({ navigation }: Props) {
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_STATE);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      getNotificationPreferences().then((result) => {
        if (isActive) setPreferences(result);
      });
      return () => {
        isActive = false;
      };
    }, []),
  );

  const toggle = async (key: keyof NotificationPreferences, value: boolean) => {
    setPreferences((current) => ({ ...current, [key]: value }));
    await updateNotificationPreferences({ [key]: value });
  };

  return (
    <ScreenContainer>
      <View style={styles.topRow}>
        <BackButton onPress={navigation.goBack} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Heading>Notification Preferences</Heading>

        <ToggleRow
          label="Push notifications"
          value={preferences.push}
          onValueChange={(value) => toggle('push', value)}
        />
        <ToggleRow label="SMS" value={preferences.sms} onValueChange={(value) => toggle('sms', value)} />
        <ToggleRow
          label="WhatsApp updates"
          value={preferences.whatsapp}
          onValueChange={(value) => toggle('whatsapp', value)}
        />

        <View style={styles.note}>
          <Caption style={styles.noteText}>
            Time-critical alerts — like a waitlist slot opening up — always reach you via WhatsApp or SMS
            if push is unavailable, regardless of the Push toggle above.
          </Caption>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topRow: {
    minHeight: 44,
    justifyContent: 'center',
  },
  scrollContent: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  note: {
    backgroundColor: colors.accent,
    borderRadius: radius.medium,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  noteText: {
    color: colors.neutralDark,
  },
});
