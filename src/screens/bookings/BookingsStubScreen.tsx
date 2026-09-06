import React from 'react';
import ScreenContainer from '../../components/ScreenContainer';
import { Body, Heading } from '../../components/Typography';

/**
 * Placeholder — Bookings tab content (Section 6.2 "Bookings Tab") ships in
 * Phase 4. This just proves the tab is routable.
 */
export default function BookingsStubScreen() {
  return (
    <ScreenContainer centered>
      <Heading>Bookings</Heading>
      <Body>Bookings tab content ships in a later phase.</Body>
    </ScreenContainer>
  );
}
