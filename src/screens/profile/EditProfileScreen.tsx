import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '../../navigation/types';
import ScreenContainer from '../../components/ScreenContainer';
import BackButton from '../../components/BackButton';
import PillTextInput from '../../components/PillTextInput';
import DateOfBirthField from '../../components/DateOfBirthField';
import SegmentedControl from '../../components/SegmentedControl';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryLink from '../../components/SecondaryLink';
import { Body, Caption, Heading } from '../../components/Typography';
import {
  dateToLocalIsoString,
  getUserProfile,
  localIsoStringToDate,
  updateUserProfile,
} from '../../state/userProfileStore';
import { colors, spacing } from '../../theme/tokens';

type Props = NativeStackScreenProps<ProfileStackParamList, 'EditProfile'>;

const GENDER_OPTIONS = ['Female', 'Male', 'Other'];

export default function EditProfileScreen({ navigation }: Props) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [gender, setGender] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      getUserProfile().then((profile) => {
        if (!isActive) return;
        setFirstName(profile.firstName);
        setLastName(profile.lastName);
        setDateOfBirth(profile.dateOfBirth ? localIsoStringToDate(profile.dateOfBirth) : null);
        setGender(profile.gender);
        setPhoneNumber(profile.phoneNumber);
      });
      return () => {
        isActive = false;
      };
    }, []),
  );

  const handleSave = async () => {
    setIsSaving(true);
    await updateUserProfile({
      firstName,
      lastName,
      dateOfBirth: dateOfBirth ? dateToLocalIsoString(dateOfBirth) : null,
      gender,
    });
    setIsSaving(false);
    navigation.goBack();
  };

  const isFormComplete = Boolean(firstName.trim() && lastName.trim() && dateOfBirth && gender);

  return (
    <ScreenContainer>
      <View style={styles.topRow}>
        <BackButton onPress={navigation.goBack} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Heading>Edit Profile</Heading>

        <View style={styles.field}>
          <PillTextInput placeholder="First name" value={firstName} onChangeText={setFirstName} />
        </View>

        <View style={styles.field}>
          <PillTextInput placeholder="Last name" value={lastName} onChangeText={setLastName} />
        </View>

        <View style={styles.field}>
          <DateOfBirthField value={dateOfBirth} onChange={setDateOfBirth} />
        </View>

        <View style={styles.field}>
          <SegmentedControl options={GENDER_OPTIONS} value={gender} onChange={setGender} />
        </View>

        <View style={styles.phoneBlock}>
          <Caption>Phone number</Caption>
          <View style={styles.phoneRow}>
            <Body>+91-{phoneNumber || 'XXXXXXXXXX'}</Body>
            <SecondaryLink
              label="Change number"
              onPress={() => navigation.navigate('ChangePhoneNumber')}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton
          label="Save changes"
          onPress={handleSave}
          disabled={!isFormComplete}
          loading={isSaving}
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
  scrollContent: {
    gap: spacing.lg,
    paddingBottom: spacing.xl,
  },
  field: {
    gap: spacing.xs,
  },
  phoneBlock: {
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: colors.accent,
    borderRadius: 999,
    paddingHorizontal: spacing.xl,
    minHeight: 44,
  },
  footer: {
    paddingVertical: spacing.lg,
  },
});
