import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import ScreenContainer from '../../components/ScreenContainer';
import BackButton from '../../components/BackButton';
import { Heading, Caption } from '../../components/Typography';
import PillTextInput from '../../components/PillTextInput';
import DateOfBirthField from '../../components/DateOfBirthField';
import SegmentedControl from '../../components/SegmentedControl';
import PrimaryButton from '../../components/PrimaryButton';
import { colors, spacing } from '../../theme/tokens';
import { setHasExistingSession } from '../../state/session';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfileDetails'>;

const GENDER_OPTIONS = ['Female', 'Male', 'Other'];

type TouchedFields = {
  firstName: boolean;
  lastName: boolean;
  dateOfBirth: boolean;
};

export default function ProfileDetailsScreen({ navigation }: Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [touched, setTouched] = useState<TouchedFields>({
    firstName: false,
    lastName: false,
    dateOfBirth: false,
  });

  const markTouched = (field: keyof TouchedFields) => {
    setTouched((current) => ({ ...current, [field]: true }));
  };

  const isFormComplete = Boolean(
    firstName.trim() && lastName.trim() && dateOfBirth && gender,
  );

  const handleContinue = async () => {
    await setHasExistingSession(true);
    navigation.replace('Home');
  };

  return (
    <ScreenContainer>
      <View style={styles.topRow}>
        <BackButton onPress={navigation.goBack} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Heading>Tell us about you</Heading>

        <View style={styles.field}>
          <PillTextInput
            placeholder="First name"
            value={firstName}
            onChangeText={setFirstName}
            onBlur={() => markTouched('firstName')}
          />
          {touched.firstName && !firstName.trim() && (
            <Caption style={styles.errorText}>First name is required.</Caption>
          )}
        </View>

        <View style={styles.field}>
          <PillTextInput
            placeholder="Last name"
            value={lastName}
            onChangeText={setLastName}
            onBlur={() => markTouched('lastName')}
          />
          {touched.lastName && !lastName.trim() && (
            <Caption style={styles.errorText}>Last name is required.</Caption>
          )}
        </View>

        <View style={styles.field}>
          <DateOfBirthField
            value={dateOfBirth}
            onChange={setDateOfBirth}
            onBlur={() => markTouched('dateOfBirth')}
          />
          {touched.dateOfBirth && !dateOfBirth && (
            <Caption style={styles.errorText}>Date of birth is required.</Caption>
          )}
        </View>

        <View style={styles.field}>
          <SegmentedControl options={GENDER_OPTIONS} value={gender} onChange={setGender} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton label="Continue" onPress={handleContinue} disabled={!isFormComplete} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topRow: {
    minHeight: 44,
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
  field: {
    gap: spacing.xs,
  },
  errorText: {
    color: colors.delayed.text,
    paddingHorizontal: spacing.sm,
  },
  footer: {
    paddingBottom: spacing.xl,
  },
});
