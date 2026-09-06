import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Per-channel notification preferences (Section 6.2 "Notification
 * Preferences") — distinct from the onboarding OS-permission prompt in
 * notificationPermission.ts. Time-critical alerts (e.g. a freed waitlist
 * slot) always fall back to WhatsApp/SMS if push is unavailable, regardless
 * of the push toggle's state here — see the handbook's v6 note on this
 * screen and Section 17.3 item 39.
 */
export type NotificationPreferences = {
  push: boolean;
  sms: boolean;
  whatsapp: boolean;
};

const STORAGE_KEY = 'openque.mockNotificationPreferences';

const DEFAULT_PREFERENCES: NotificationPreferences = {
  push: true,
  sms: true,
  whatsapp: true,
};

let cachedPreferences: NotificationPreferences | null = null;

async function load(): Promise<NotificationPreferences> {
  if (cachedPreferences) return cachedPreferences;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    cachedPreferences = raw
      ? { ...DEFAULT_PREFERENCES, ...(JSON.parse(raw) as NotificationPreferences) }
      : DEFAULT_PREFERENCES;
  } catch {
    cachedPreferences = DEFAULT_PREFERENCES;
  }
  return cachedPreferences;
}

export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  return load();
}

export async function updateNotificationPreferences(
  partial: Partial<NotificationPreferences>,
): Promise<NotificationPreferences> {
  const current = await load();
  const next = { ...current, ...partial };
  cachedPreferences = next;
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // best-effort
  }
  return next;
}

export function resetNotificationPreferencesCache(): void {
  cachedPreferences = null;
}
