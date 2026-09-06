import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '../../navigation/types';
import ScreenContainer from '../../components/ScreenContainer';
import BackButton from '../../components/BackButton';
import PillTextInput from '../../components/PillTextInput';
import AccordionItem from '../../components/AccordionItem';
import SecondaryLink from '../../components/SecondaryLink';
import { Body, Heading } from '../../components/Typography';
import { spacing } from '../../theme/tokens';

type Props = NativeStackScreenProps<ProfileStackParamList, 'HelpFaq'>;

const FAQS: { question: string; answer: string }[] = [
  {
    question: 'How do I cancel or reschedule an appointment?',
    answer:
      'Open the Bookings tab, tap the appointment, then use Reschedule or Cancel. Both are free any time before your appointment, and are available until you check in at the hospital.',
  },
  {
    question: 'What happens once I check in at the hospital?',
    answer:
      'Your appointment moves into the live queue. Self-serve reschedule and cancel turn off at that point — the front desk can still help if you need a change.',
  },
  {
    question: 'How is my position in the queue calculated?',
    answer:
      'We show your position in plain language (e.g. "2 people ahead of you") rather than an exact wait time, since consultation lengths vary.',
  },
  {
    question: 'Do I need to pay online when booking?',
    answer: 'No — OpenQue is cash-at-hospital only for now. You pay the consultation fee at the front desk.',
  },
  {
    question: 'How do I change my registered phone number?',
    answer:
      'Go to Profile > Edit Profile > Change number. You will need to verify the new number with an OTP.',
  },
];

export default function HelpFaqScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return FAQS;
    return FAQS.filter(
      (item) =>
        item.question.toLowerCase().includes(normalized) || item.answer.toLowerCase().includes(normalized),
    );
  }, [query]);

  return (
    <ScreenContainer>
      <View style={styles.topRow}>
        <BackButton onPress={navigation.goBack} />
      </View>

      <Heading>Help & FAQ</Heading>

      <PillTextInput
        style={styles.search}
        placeholder="Search FAQs"
        value={query}
        onChangeText={setQuery}
      />

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <Body style={styles.emptyText}>No FAQs match "{query}".</Body>
        ) : (
          filtered.map((item) => (
            <AccordionItem key={item.question} question={item.question} answer={item.answer} />
          ))
        )}
      </ScrollView>

      <View style={styles.footer}>
        <SecondaryLink
          label="Still need help? Contact support."
          onPress={() => navigation.navigate('ContactSupport')}
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
  search: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  list: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
});
