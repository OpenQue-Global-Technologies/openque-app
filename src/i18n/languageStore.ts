import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Language } from './translations';

/**
 * Decided v6 — Section 17.3 item 23: hybrid scope. Stored locally for
 * immediate UI/guest state (persistLanguage), and separately "synced" to the
 * server (syncLanguageToServer) so transactional notifications and
 * multi-device sessions would honor the chosen language — mocked here as a
 * network delay since there's no backend yet.
 */
const STORAGE_KEY = 'openque.mockLanguage';

export async function getStoredLanguage(): Promise<Language> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    if (value === 'en' || value === 'ta') return value;
  } catch {
    // fall through to default
  }
  return 'en';
}

export async function persistLanguage(language: Language): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, language);
  } catch {
    // best-effort — in-memory state still reflects the change this session
  }
}

const MOCK_SYNC_DELAY_MS = 600;

export async function syncLanguageToServer(_language: Language): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_SYNC_DELAY_MS));
}
