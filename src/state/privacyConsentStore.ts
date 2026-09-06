import AsyncStorage from '@react-native-async-storage/async-storage';

/** Data-sharing consent toggles (Section 6.2 "Privacy Settings", DPDP-aligned). */
export type PrivacyConsents = {
  analytics: boolean;
  partnerSharing: boolean;
  personalizedRecommendations: boolean;
};

const STORAGE_KEY = 'openque.mockPrivacyConsents';

const DEFAULT_CONSENTS: PrivacyConsents = {
  analytics: true,
  partnerSharing: false,
  personalizedRecommendations: true,
};

let cachedConsents: PrivacyConsents | null = null;

async function load(): Promise<PrivacyConsents> {
  if (cachedConsents) return cachedConsents;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    cachedConsents = raw ? { ...DEFAULT_CONSENTS, ...(JSON.parse(raw) as PrivacyConsents) } : DEFAULT_CONSENTS;
  } catch {
    cachedConsents = DEFAULT_CONSENTS;
  }
  return cachedConsents;
}

export async function getPrivacyConsents(): Promise<PrivacyConsents> {
  return load();
}

export async function updatePrivacyConsents(partial: Partial<PrivacyConsents>): Promise<PrivacyConsents> {
  const current = await load();
  const next = { ...current, ...partial };
  cachedConsents = next;
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // best-effort
  }
  return next;
}

export function resetPrivacyConsentCache(): void {
  cachedConsents = null;
}
