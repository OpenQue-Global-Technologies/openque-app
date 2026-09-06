import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from './Card';
import { Body, Caption } from './Typography';
import { colors, spacing } from '../theme/tokens';

type Props = {
  question: string;
  answer: string;
};

export default function AccordionItem({ question, answer }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card style={styles.card}>
      <Pressable
        onPress={() => setIsExpanded((current) => !current)}
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
        style={styles.header}
      >
        <Body style={styles.question}>{question}</Body>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={colors.neutralMuted}
        />
      </Pressable>
      {isExpanded && (
        <View style={styles.answerBlock}>
          <Caption style={styles.answer}>{answer}</Caption>
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    padding: spacing.lg,
  },
  question: {
    flex: 1,
    fontSize: 15,
  },
  answerBlock: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  answer: {
    lineHeight: 18,
  },
});
