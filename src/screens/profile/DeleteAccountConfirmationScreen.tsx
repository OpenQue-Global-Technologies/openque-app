import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '../../navigation/types';
import ScreenContainer from '../../components/ScreenContainer';
import { Heading } from '../../components/Typography';
import { colors, spacing } from '../../theme/tokens';
import { wipeAllMockData } from '../../state/accountActions';
import { resetBookingsCache } from '../../state/bookingsStore';
import { resetUserProfileCache } from '../../state/userProfileStore';
import { resetNotificationPreferencesCache } from '../../state/notificationPreferencesStore';
import { resetPrivacyConsentCache } from '../../state/privacyConsentStore';
import { useLanguage } from '../../i18n/LanguageContext';
import { resetToSplash } from '../../navigation/navigationRef';

type Props = NativeStackScreenProps<ProfileStackParamList, 'DeleteAccountConfirmation'>;

const AUTO_ADVANCE_MS = 2000;

export default function DeleteAccountConfirmationScreen(_props: Props) {
  const { resetToDefault } = useLanguage();

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    // A real backend would soft-delete for 15-30 days before a hard purge
    // (see the grace-period copy on the previous screen) — this mock has no
    // server, so the client wipes its local mock data immediately, which is
    // the part of that lifecycle actually visible on-device.
    (async () => {
      await wipeAllMockData();
      resetBookingsCache();
      resetUserProfileCache();
      resetNotificationPreferencesCache();
      resetPrivacyConsentCache();
      resetToDefault();
      timeoutId = setTimeout(resetToSplash, AUTO_ADVANCE_MS);
    })();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScreenContainer centered>
      <View style={styles.iconCircle}>
        <Ionicons name="checkmark" size={56} color={colors.neutralDark} />
      </View>
      <Heading style={styles.heading}>Your account has been deleted.</Heading>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.cancelled.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  heading: {
    textAlign: 'center',
  },
});
