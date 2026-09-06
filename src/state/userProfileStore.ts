import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Mocked user profile — no backend yet. Populated by onboarding
 * (ProfileDetailsScreen, OtpVerifiedScreen) and edited from the Profile tab.
 */
export type UserProfile = {
  firstName: string;
  lastName: string;
  dateOfBirth: string | null; // ISO date
  gender: string | null;
  phoneNumber: string;
};

const STORAGE_KEY = 'openque.mockUserProfile';

const DEFAULT_PROFILE: UserProfile = {
  firstName: '',
  lastName: '',
  dateOfBirth: null,
  gender: null,
  phoneNumber: '',
};

let cachedProfile: UserProfile | null = null;

async function load(): Promise<UserProfile> {
  if (cachedProfile) return cachedProfile;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    cachedProfile = raw ? { ...DEFAULT_PROFILE, ...(JSON.parse(raw) as UserProfile) } : DEFAULT_PROFILE;
  } catch {
    cachedProfile = DEFAULT_PROFILE;
  }
  return cachedProfile;
}

export async function getUserProfile(): Promise<UserProfile> {
  return load();
}

export async function updateUserProfile(partial: Partial<UserProfile>): Promise<UserProfile> {
  const current = await load();
  const next = { ...current, ...partial };
  cachedProfile = next;
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // best-effort — in-memory cache still reflects the write this session
  }
  return next;
}

/** Called after Delete Account wipes storage, so a fresh signup this same session re-reads defaults. */
export function resetUserProfileCache(): void {
  cachedProfile = null;
}

/**
 * Date-of-birth is a calendar date, not an instant — serialize/parse it
 * using local Y/M/D components. `Date#toISOString()` converts to UTC first,
 * which silently shifts the date by a day for anyone west or east of UTC at
 * the wrong time of day, and `new Date("YYYY-MM-DD")` parses that string as
 * UTC midnight rather than local midnight, compounding the shift.
 */
export function dateToLocalIsoString(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function localIsoStringToDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day);
}
