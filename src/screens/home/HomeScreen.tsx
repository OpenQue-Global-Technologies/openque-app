import React from 'react';
import { StyleSheet } from 'react-native';
import ScreenContainer from '../../components/ScreenContainer';
import { Heading, Body } from '../../components/Typography';
import { spacing } from '../../theme/tokens';

/**
 * Placeholder Home — proves onboarding navigation completes. Home tab
 * content (discovery, search, booking entry point) is out of scope for the
 * onboarding phase and lands in a later phase.
 */
export default function HomeScreen() {
  return (
    <ScreenContainer centered>
      <Heading>Home</Heading>
      <Body style={styles.body}>Onboarding complete. Home tab content ships in a later phase.</Body>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: {
    marginTop: spacing.sm,
    textAlign: 'center',
  },
});
