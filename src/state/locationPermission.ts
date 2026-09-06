import * as Location from 'expo-location';

/**
 * Requests location access via Expo's real permission API where available.
 * Onboarding never blocks on the outcome — granted or denied, the flow
 * still proceeds to Notification Access next, per the happy-path spec.
 */
export async function requestLocationPermission(): Promise<boolean> {
  try {
    const result = await Location.requestForegroundPermissionsAsync();
    return result.granted;
  } catch {
    return false;
  }
}
