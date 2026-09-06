import React, { useCallback, useState } from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '../../navigation/types';
import ScreenContainer from '../../components/ScreenContainer';
import BackButton from '../../components/BackButton';
import ToggleRow from '../../components/ToggleRow';
import SecondaryLink from '../../components/SecondaryLink';
import { Heading } from '../../components/Typography';
import {
  getPrivacyConsents,
  updatePrivacyConsents,
  type PrivacyConsents,
} from '../../state/privacyConsentStore';
import { spacing } from '../../theme/tokens';

type Props = NativeStackScreenProps<ProfileStackParamList, 'PrivacySettings'>;

const DEFAULT_STATE: PrivacyConsents = {
  analytics: true,
  partnerSharing: false,
  personalizedRecommendations: true,
};

export default function PrivacySettingsScreen({ navigation }: Props) {
  const [consents, setConsents] = useState<PrivacyConsents>(DEFAULT_STATE);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      getPrivacyConsents().then((result) => {
        if (isActive) setConsents(result);
      });
      return () => {
        isActive = false;
      };
    }, []),
  );

  const toggle = async (key: keyof PrivacyConsents, value: boolean) => {
    setConsents((current) => ({ ...current, [key]: value }));
    await updatePrivacyConsents({ [key]: value });
  };

  return (
    <ScreenContainer>
      <View style={styles.topRow}>
        <BackButton onPress={navigation.goBack} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Heading>Privacy Settings</Heading>

        <ToggleRow
          label="Usage analytics"
          description="Helps us understand which features are useful."
          value={consents.analytics}
          onValueChange={(value) => toggle('analytics', value)}
        />
        <ToggleRow
          label="Sharing with partner hospitals"
          description="Lets partner hospitals see your booking history with them."
          value={consents.partnerSharing}
          onValueChange={(value) => toggle('partnerSharing', value)}
        />
        <ToggleRow
          label="Personalized recommendations"
          description="Uses your booking history to suggest doctors and hospitals."
          value={consents.personalizedRecommendations}
          onValueChange={(value) => toggle('personalizedRecommendations', value)}
        />

        <View style={styles.linkRow}>
          <SecondaryLink
            label="View our privacy policy"
            onPress={() => Linking.openURL('https://openque.in/privacy')}
          />
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
  linkRow: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
});
