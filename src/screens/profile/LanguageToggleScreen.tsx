import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '../../navigation/types';
import ScreenContainer from '../../components/ScreenContainer';
import BackButton from '../../components/BackButton';
import PrimaryButton from '../../components/PrimaryButton';
import { Body, Caption, Heading } from '../../components/Typography';
import { useLanguage } from '../../i18n/LanguageContext';
import type { Language } from '../../i18n/translations';
import { colors, radius, spacing } from '../../theme/tokens';

type Props = NativeStackScreenProps<ProfileStackParamList, 'LanguageToggle'>;

const OPTIONS: { value: Language; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'ta', label: 'Tamil' },
];

export default function LanguageToggleScreen({ navigation }: Props) {
  const { language, isSyncing, setLanguage } = useLanguage();
  const [selected, setSelected] = useState<Language>(language);
  const [didApply, setDidApply] = useState(false);

  const handleApply = async () => {
    await setLanguage(selected);
    setDidApply(true);
  };

  return (
    <ScreenContainer>
      <View style={styles.topRow}>
        <BackButton onPress={navigation.goBack} />
      </View>

      <Heading>Language</Heading>

      <View style={styles.options}>
        {OPTIONS.map((option) => {
          const isSelected = option.value === selected;
          return (
            <Pressable
              key={option.value}
              onPress={() => {
                setSelected(option.value);
                setDidApply(false);
              }}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              style={styles.option}
            >
              <Ionicons
                name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                size={22}
                color={isSelected ? colors.primary : colors.neutralMuted}
              />
              <Body>{option.label}</Body>
            </Pressable>
          );
        })}
      </View>

      {didApply && !isSyncing && (
        <Caption style={styles.statusText}>Saved — synced to your account.</Caption>
      )}

      <View style={styles.footer}>
        {isSyncing && (
          <View style={styles.syncingRow}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Caption>Syncing to your account…</Caption>
          </View>
        )}
        <PrimaryButton label="Apply" onPress={handleApply} disabled={isSyncing} loading={isSyncing} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topRow: {
    minHeight: 44,
    justifyContent: 'center',
  },
  options: {
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 48,
    paddingHorizontal: spacing.md,
    borderRadius: radius.medium,
    backgroundColor: colors.white,
  },
  statusText: {
    marginTop: spacing.md,
    color: colors.success.text,
  },
  footer: {
    marginTop: 'auto',
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  syncingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
});
