import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import ScreenContainer from '../../components/ScreenContainer';
import BackButton from '../../components/BackButton';
import { Body } from '../../components/Typography';
import PillTextInput from '../../components/PillTextInput';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryLink from '../../components/SecondaryLink';
import { colors, radius, spacing } from '../../theme/tokens';
import { requestLocationPermission } from '../../state/locationPermission';

type Props = NativeStackScreenProps<RootStackParamList, 'EnterLocationManually'>;

// Mocked suggestions — no places/geocoding provider wired up yet.
const MOCK_SUGGESTIONS = [
  'Anna Nagar, Chennai',
  'Koramangala, Bengaluru',
  'Andheri West, Mumbai',
  'Banjara Hills, Hyderabad',
  'Salt Lake, Kolkata',
  '600001, Chennai',
];

export default function EnterLocationManuallyScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  const suggestions = useMemo(() => {
    if (!query.trim() || selected) return [];
    return MOCK_SUGGESTIONS.filter((item) =>
      item.toLowerCase().includes(query.trim().toLowerCase()),
    );
  }, [query, selected]);

  const handleChangeText = (text: string) => {
    setQuery(text);
    setSelected(null);
  };

  const handleSelect = (item: string) => {
    setSelected(item);
    setQuery(item);
  };

  const handleUseCurrentLocation = async () => {
    await requestLocationPermission();
    setSelected('Current location');
    setQuery('Current location');
  };

  const handleConfirm = () => {
    navigation.replace('NotificationAccess');
  };

  return (
    <ScreenContainer>
      <View style={styles.topRow}>
        <BackButton onPress={navigation.goBack} />
      </View>

      <View style={styles.content}>
        <PillTextInput
          placeholder="Search area, locality, or pincode"
          value={query}
          onChangeText={handleChangeText}
          autoFocus
        />

        {suggestions.length > 0 && (
          <View style={styles.dropdown}>
            <FlatList
              data={suggestions}
              keyExtractor={(item) => item}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <Pressable style={styles.suggestionRow} onPress={() => handleSelect(item)}>
                  <Body>{item}</Body>
                </Pressable>
              )}
            />
          </View>
        )}

        <View style={styles.useCurrentLocation}>
          <SecondaryLink label="Use current location" onPress={handleUseCurrentLocation} />
        </View>
      </View>

      <View style={styles.footer}>
        <PrimaryButton label="Confirm location" onPress={handleConfirm} disabled={!selected} />
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
    gap: spacing.lg,
  },
  dropdown: {
    backgroundColor: colors.white,
    borderRadius: radius.medium,
    borderWidth: 1,
    borderColor: colors.accent,
    overflow: 'hidden',
  },
  suggestionRow: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
    minHeight: 44,
    justifyContent: 'center',
  },
  useCurrentLocation: {
    alignItems: 'flex-start',
  },
  footer: {
    paddingBottom: spacing.xl,
  },
});
