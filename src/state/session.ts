import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Mocked session check for Splash. Stands in for a real auth/session API —
 * no backend exists yet. Toggle via setHasExistingSession to demo either path.
 */
const SESSION_KEY = 'openque.mockSession.hasExistingSession';

export async function getHasExistingSession(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(SESSION_KEY);
    return value === 'true';
  } catch {
    return false;
  }
}

export async function setHasExistingSession(hasSession: boolean): Promise<void> {
  await AsyncStorage.setItem(SESSION_KEY, hasSession ? 'true' : 'false');
}
