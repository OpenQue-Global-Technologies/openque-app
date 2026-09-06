import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '../../navigation/types';
import ScreenContainer from '../../components/ScreenContainer';
import BackButton from '../../components/BackButton';
import Card from '../../components/Card';
import Dropdown from '../../components/Dropdown';
import PillTextInput from '../../components/PillTextInput';
import PrimaryButton from '../../components/PrimaryButton';
import Toast from '../../components/Toast';
import { Body, Caption, Heading, SubHeading } from '../../components/Typography';
import { HOSPITALS } from '../../data/mockData';
import { colors, spacing } from '../../theme/tokens';

type Props = NativeStackScreenProps<ProfileStackParamList, 'GrievanceSubmission'>;

type ComplaintNature = 'Software / App Issue' | 'Data Privacy' | 'Billing Dispute' | 'Doctor / Clinical Conduct';
const NATURES: ComplaintNature[] = [
  'Software / App Issue',
  'Data Privacy',
  'Billing Dispute',
  'Doctor / Clinical Conduct',
];

const TOAST_DURATION_MS = 2200;

// Mock "home hospital" for the Nodal Officer contact — this app has no
// per-user default-hospital concept yet, so the nearest/first hospital
// stands in for it.
const NODAL_HOSPITAL = HOSPITALS[0];

export default function GrievanceSubmissionScreen({ navigation }: Props) {
  const [nature, setNature] = useState<ComplaintNature>('Software / App Issue');
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
      <Toast visible={showToast} message="Grievance submitted." />

      <View style={styles.topRow}>
        <BackButton onPress={navigation.goBack} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Heading>Grievance Submission</Heading>

        <View style={styles.field}>
          <Caption>Nature of complaint</Caption>
          <Dropdown label="Nature" value={nature} options={NATURES} onChange={setNature} />
        </View>

        <View style={styles.field}>
          <Caption>Description</Caption>
          <PillTextInput
            style={styles.description}
            placeholder="Describe your grievance…"
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />
        </View>

        <PrimaryButton
          label="Submit grievance"
          onPress={handleSubmit}
          disabled={!description.trim() || isSubmitting}
          loading={isSubmitting}
        />

        <View style={styles.contactsSection}>
          <Card style={styles.contactCard}>
            <SubHeading style={styles.contactHeading}>OpenQue Grievance Officer</SubHeading>
            <Caption style={styles.contactScope}>
              For software, data-privacy, account, or payment-process issues.
            </Caption>
            <Body style={styles.contactLine}>Ms. Ananya Krishnan</Body>
            <Caption>grievance-officer@openque.in</Caption>
            <Caption>+91-44-6800-1200</Caption>
          </Card>

          <Card style={styles.contactCard}>
            <SubHeading style={styles.contactHeading}>{NODAL_HOSPITAL.name} — Nodal Officer</SubHeading>
            <Caption style={styles.contactScope}>
              For clinical conduct, billing disputes, or doctor delays at this hospital.
            </Caption>
            <Body style={styles.contactLine}>Mr. Suresh Pillai</Body>
            <Caption>nodal.officer@sunrisehospital.example</Caption>
            <Caption>+91-44-2345-6789</Caption>
          </Card>
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
    gap: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  field: {
    gap: spacing.xs,
  },
  description: {
    minHeight: 100,
    paddingTop: spacing.md,
  },
  contactsSection: {
    gap: spacing.md,
    marginTop: spacing.md,
  },
  contactCard: {
    gap: 2,
  },
  contactHeading: {
    fontSize: 16,
  },
  contactScope: {
    color: colors.neutralMuted,
    marginBottom: spacing.xs,
  },
  contactLine: {
    marginTop: spacing.xs,
  },
});
