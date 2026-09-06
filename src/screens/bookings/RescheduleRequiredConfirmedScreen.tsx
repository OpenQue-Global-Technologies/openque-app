import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BookingsStackParamList } from '../../navigation/types';
import ScreenContainer from '../../components/ScreenContainer';
import PrimaryButton from '../../components/PrimaryButton';
import { Heading } from '../../components/Typography';
import { colors, spacing } from '../../theme/tokens';

type Props = NativeStackScreenProps<BookingsStackParamList, 'RescheduleRequiredConfirmed'>;

export default function RescheduleRequiredConfirmedScreen({ navigation, route }: Props) {
  const { date, time } = route.params;
  const formattedDate = new Date(date).toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <ScreenContainer centered>
      <View style={styles.iconCircle}>
        <Ionicons name="checkmark" size={56} color={colors.success.text} />
      </View>
      <Heading style={styles.heading}>
        You&apos;re rescheduled to {formattedDate} at {time}.
      </Heading>

      <View style={styles.footer}>
        <PrimaryButton label="Done" onPress={() => navigation.popToTop()} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.success.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  heading: {
    textAlign: 'center',
  },
  footer: {
    width: '100%',
    marginTop: spacing.xxxl,
  },
});
