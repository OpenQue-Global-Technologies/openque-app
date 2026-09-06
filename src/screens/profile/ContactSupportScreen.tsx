import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '../../navigation/types';
import ScreenContainer from '../../components/ScreenContainer';
import BackButton from '../../components/BackButton';
import Dropdown from '../../components/Dropdown';
import PillTextInput from '../../components/PillTextInput';
import PrimaryButton from '../../components/PrimaryButton';
import Toast from '../../components/Toast';
import { Caption, Heading } from '../../components/Typography';
import { spacing } from '../../theme/tokens';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ContactSupport'>;

type Category = 'Booking' | 'Technical' | 'Other';
const CATEGORIES: Category[] = ['Booking', 'Technical', 'Other'];

const TOAST_DURATION_MS = 2200;

export default function ContactSupportScreen({ navigation }: Props) {
  const [category, setCategory] = useState<Category>('Booking');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setShowToast(true);
    setTimeout(() => {
      navigation.goBack();
    }, TOAST_DURATION_MS);
  };

  return (
    <ScreenContainer>
      <Toast visible={showToast} message="We'll respond within 24 hours." />

      <View style={styles.topRow}>
        <BackButton onPress={navigation.goBack} />
      </View>

      <Heading>Contact Support</Heading>

      <View style={styles.field}>
        <Caption>Issue category</Caption>
        <Dropdown label="Category" value={category} options={CATEGORIES} onChange={setCategory} />
      </View>

      <View style={styles.field}>
        <Caption>Describe your issue</Caption>
        <PillTextInput
          style={styles.description}
          placeholder="Tell us what's going on…"
          value={description}
          onChangeText={setDescription}
          multiline
          textAlignVertical="top"
        />
      </View>

      <View style={styles.footer}>
        <PrimaryButton
          label="Submit"
          onPress={handleSubmit}
          disabled={!description.trim() || isSubmitting}
          loading={isSubmitting}
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
  field: {
    gap: spacing.xs,
    marginTop: spacing.lg,
  },
  description: {
    minHeight: 120,
    paddingTop: spacing.md,
  },
  footer: {
    marginTop: 'auto',
    paddingBottom: spacing.xl,
  },
});
