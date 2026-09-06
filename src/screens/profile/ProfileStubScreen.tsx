import React from 'react';
import ScreenContainer from '../../components/ScreenContainer';
import { Body, Heading } from '../../components/Typography';

/**
 * Placeholder — Profile tab content (Section 6.2 "Profile") ships in a
 * later phase. This just proves the tab is routable.
 */
export default function ProfileStubScreen() {
  return (
    <ScreenContainer centered>
      <Heading>Profile</Heading>
      <Body>Profile tab content ships in a later phase.</Body>
    </ScreenContainer>
  );
}
