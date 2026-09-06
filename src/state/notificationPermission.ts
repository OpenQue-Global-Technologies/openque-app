import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

/**
 * Mocked notification permission state, persisted so a relaunch after
 * "Maybe Later" reproduces the real-world case where the OS remembers a
 * prior denial and stops prompting — this is what drives the
 * Previously-Denied Re-Prompt screen. The real Expo Notifications API is
 * also queried opportunistically, but a failure or unsupported platform
 * (e.g. web) never blocks onboarding from proceeding.
 */
const STATUS_KEY = 'openque.mockPermission.notifications';

export type MockPermissionStatus = 'undetermined' | 'granted' | 'denied';

export async function getStoredNotificationStatus(): Promise<MockPermissionStatus> {
  try {
    const value = await AsyncStorage.getItem(STATUS_KEY);
    if (value === 'granted' || value === 'denied') {
      return value;
    }
  } catch {
    // fall through to undetermined
  }
  return 'undetermined';
}

async function persist(status: MockPermissionStatus): Promise<void> {
  try {
    await AsyncStorage.setItem(STATUS_KEY, status);
  } catch {
    // best-effort — the in-memory nav flow still works this session
  }
}

export async function requestNotificationPermission(): Promise<MockPermissionStatus> {
  try {
    const result = await Notifications.requestPermissionsAsync();
    const status: MockPermissionStatus = result.granted ? 'granted' : 'denied';
    await persist(status);
    return status;
  } catch {
    await persist('granted');
    return 'granted';
  }
}

export async function declineNotificationPermission(): Promise<void> {
  await persist('denied');
}
