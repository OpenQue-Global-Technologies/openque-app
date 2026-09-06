import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Client-side simulation of Section 9.1's state machine — there is no
 * OpenQue AIR yet to drive this from real receptionist/doctor actions, so a
 * dev-only panel (see DevQueuePanel) advances it instead. Persisted per
 * booking so a reload during manual testing doesn't lose position.
 *
 * Full path used (not the Solo-mode collapse): BOOKED -> WAITING -> CALLED ->
 * IN_CONSULTATION -> COMPLETED. REFERRED/RETURNING and NO_SHOW are out of
 * scope this phase.
 */
export type QueueState = 'BOOKED' | 'WAITING' | 'CALLED' | 'IN_CONSULTATION' | 'COMPLETED';

const STORAGE_KEY_PREFIX = 'openque.mockQueueState.';

export async function getQueueState(bookingId: string): Promise<QueueState> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY_PREFIX + bookingId);
    if (
      value === 'BOOKED' ||
      value === 'WAITING' ||
      value === 'CALLED' ||
      value === 'IN_CONSULTATION' ||
      value === 'COMPLETED'
    ) {
      return value;
    }
  } catch {
    // fall through to default
  }
  return 'BOOKED';
}

export async function setQueueState(bookingId: string, state: QueueState): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY_PREFIX + bookingId, state);
  } catch {
    // best-effort — in-memory nav flow still works this session
  }
}

/**
 * Module B (9.3) — Position Calculation. Bucketed, position-based language
 * only; never a countdown or exact-minute estimate. `aheadCount` is only
 * consulted for WAITING — this demo has no other simulated patients, so the
 * caller supplies a fixed demo value (see AHEAD_COUNT_DEMO) rather than this
 * function inventing one.
 */
export function getPatientFacingStatus(aheadCount: number, state: QueueState): string {
  if (state === 'CALLED' || state === 'IN_CONSULTATION') {
    return 'Your consultation starts in a few minutes';
  }
  if (aheadCount === 0) {
    return 'Your consultation starts in less than 10 minutes';
  }
  if (aheadCount === 1) {
    return '1 person ahead of you';
  }
  if (aheadCount === 2) {
    return '2 people ahead of you — this may shift slightly if a returning patient is added in between';
  }
  return "You're in the queue — we'll notify you as your turn gets closer";
}

// Fixed demo value — no second simulated patient exists to derive a real count from.
export const AHEAD_COUNT_DEMO = 2;
