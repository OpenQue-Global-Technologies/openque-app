import React from 'react';
import ScreenContainer from '../../components/ScreenContainer';
import { Body, Heading } from '../../components/Typography';

/**
 * Placeholder — Queue tab content (Section 6.2 "Queue") ships in a later
 * phase. This just proves the tab is routable.
 */
export default function QueueStubScreen() {
  return (
    <ScreenContainer centered>
      <Heading>Queue</Heading>
      <Body>Queue tab content ships in a later phase.</Body>
    </ScreenContainer>
  );
}
