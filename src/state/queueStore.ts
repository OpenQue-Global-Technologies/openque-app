import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Client-side simulation of Section 9.1's state machine — there is no
 * OpenQue AIR yet to drive this from real receptionist/doctor actions, so a
 * dev-only panel (see DevQueuePanel) advances it instead. Persisted per
 * booking so a reload during manual testing doesn't lose position.
 *
 * Full path used (not the Solo-mode collapse): BOOKED -> WAITING -> CALLED ->
 * IN_CONSULTATION -> COMPLETED, with the referral loop IN_CONSULTATION ->
 * REFERRED -> RETURNING -> CALLED (back into consultation) per Section 9.6.
 * NO_SHOW (desk-recorded LEFT_WITHOUT_BEING_SEEN, Section 6.2) is reachable
 * from WAITING via the dev panel for rendering the Past "No-show" tag.
 */
export type QueueState =
  | 'BOOKED'
  | 'WAITING'
  | 'CALLED'
  | 'IN_CONSULTATION'
  | 'REFERRED'
  | 'RETURNING'
  | 'COMPLETED'
  | 'NO_SHOW';

const VALID_STATES: QueueState[] = [
  'BOOKED',
  'WAITING',
  'CALLED',
  'IN_CONSULTATION',
  'REFERRED',
  'RETURNING',
  'COMPLETED',
  'NO_SHOW',
];

function isValidState(value: unknown): value is QueueState {
  return typeof value === 'string' && (VALID_STATES as string[]).includes(value);
}

// Fixed demo baseline — no second simulated patient exists to derive a real
// count from; the dev panel's "queue shift" action bumps this per booking.
export const AHEAD_COUNT_DEMO = 2;

/**
 * Everything the simulated state machine tracks for one booking. `wasReferred`
 * lets the UI (QueueProgressBar) know to keep showing the Test/Scan stage
 * even after the patient has looped back through CALLED/IN_CONSULTATION a
 * second time, since the bare `state` value can't distinguish a first visit
 * to IN_CONSULTATION from a second one after a referral.
 */
export type QueueRecord = {
  state: QueueState;
  wasReferred: boolean;
  isRunningBehind: boolean;
  aheadCount: number;
};

const DEFAULT_RECORD: QueueRecord = {
  state: 'BOOKED',
  wasReferred: false,
  isRunningBehind: false,
  aheadCount: AHEAD_COUNT_DEMO,
};

const STORAGE_KEY_PREFIX = 'openque.mockQueueState.';

async function loadRecord(bookingId: string): Promise<QueueRecord> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY_PREFIX + bookingId);
    if (!raw) return { ...DEFAULT_RECORD };
    try {
      const parsed = JSON.parse(raw) as Partial<QueueRecord>;
      if (parsed && typeof parsed === 'object') {
        return {
          state: isValidState(parsed.state) ? parsed.state : 'BOOKED',
          wasReferred: Boolean(parsed.wasReferred),
          isRunningBehind: Boolean(parsed.isRunningBehind),
          aheadCount: typeof parsed.aheadCount === 'number' ? parsed.aheadCount : AHEAD_COUNT_DEMO,
        };
      }
    } catch {
      // Legacy plain-string value from an earlier phase (before this record
      // shape existed) — treat it as just the state, rest at defaults.
      if (isValidState(raw)) return { ...DEFAULT_RECORD, state: raw };
    }
  } catch {
    // fall through to default
  }
  return { ...DEFAULT_RECORD };
}

async function persistRecord(bookingId: string, record: QueueRecord): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY_PREFIX + bookingId, JSON.stringify(record));
  } catch {
    // best-effort — in-memory nav flow still works this session
  }
}

export async function getQueueRecord(bookingId: string): Promise<QueueRecord> {
  return loadRecord(bookingId);
}

export async function getQueueState(bookingId: string): Promise<QueueState> {
  return (await loadRecord(bookingId)).state;
}

/**
 * Transitions to a new state. Resetting to BOOKED (the dev panel's "Reset
 * demo" action) also clears every situational flag, so re-running the demo
 * doesn't inherit a stale referral/delay/position-shift from the last pass.
 */
export async function setQueueState(bookingId: string, state: QueueState): Promise<void> {
  const current = await loadRecord(bookingId);
  if (state === 'BOOKED') {
    await persistRecord(bookingId, { ...DEFAULT_RECORD });
    return;
  }
  const next: QueueRecord = {
    ...current,
    state,
    wasReferred: current.wasReferred || state === 'REFERRED',
  };
  await persistRecord(bookingId, next);
}

export async function getIsRunningBehind(bookingId: string): Promise<boolean> {
  return (await loadRecord(bookingId)).isRunningBehind;
}

export async function setIsRunningBehind(bookingId: string, value: boolean): Promise<void> {
  const current = await loadRecord(bookingId);
  await persistRecord(bookingId, { ...current, isRunningBehind: value });
}

export async function getAheadCount(bookingId: string): Promise<number> {
  return (await loadRecord(bookingId)).aheadCount;
}

/** Module B (9.3) "Queue Updated" event — a returning patient inserted ahead. */
export async function bumpAheadCount(bookingId: string): Promise<number> {
  const current = await loadRecord(bookingId);
  const next = current.aheadCount + 1;
  await persistRecord(bookingId, { ...current, aheadCount: next });
  return next;
}

/**
 * Module B (9.3) — Position Calculation. Bucketed, position-based language
 * only; never a countdown or exact-minute estimate. REFERRED has no position
 * concept (the patient has left the callable list for their test/scan), so it
 * gets the static reassurance line from Section 9.6 instead. RETURNING is
 * back in the callable list, so it uses the same bucketed logic as WAITING.
 */
export function getPatientFacingStatus(aheadCount: number, state: QueueState): string {
  if (state === 'CALLED' || state === 'IN_CONSULTATION') {
    return 'Your consultation starts in a few minutes';
  }
  if (state === 'REFERRED') {
    return "You'll be called again once ready — no need to check in twice.";
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

/** Module H (9.9) — Running Behind Detection, patient-facing copy. */
export const RUNNING_BEHIND_STATUS_TEXT =
  'Running slightly behind schedule — updated estimate: 15-20 min.';
