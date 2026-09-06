import { createNavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList } from './types';

/**
 * Logout and Delete Account need to reset all the way back to Splash from
 * deep inside a nested tab stack (e.g. ProfileStack > DeleteAccountConfirmation).
 * A ref-based reset avoids threading getParent() chains through every screen
 * in between.
 */
export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function resetToSplash(): void {
  if (navigationRef.isReady()) {
    navigationRef.reset({ index: 0, routes: [{ name: 'Splash' }] });
  }
}
