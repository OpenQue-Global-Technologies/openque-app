import AsyncStorage from '@react-native-async-storage/async-storage';
import { setHasExistingSession } from './session';

/** Logout — clears the session only. Booking history and profile stay put. */
export async function logout(): Promise<void> {
  await setHasExistingSession(false);
}

/**
 * Delete Account (Section 6.2 / Module — mock). A real backend would soft-
 * delete for 15-30 days before a hard purge; this mock has no server, so the
 * client-visible effect (immediate logout, data no longer shown) is applied
 * right away. All app storage is namespaced under "openque." so it can be
 * wiped generically without every store module needing to know about
 * account deletion.
 */
export async function wipeAllMockData(): Promise<void> {
  const keys = await AsyncStorage.getAllKeys();
  const mockKeys = keys.filter((key) => key.startsWith('openque.'));
  if (mockKeys.length > 0) {
    await AsyncStorage.multiRemove(mockKeys);
  }
}
