/**
 * Dev-only toggle for the patient's mock push token state, so the delivery
 * fallback chain in Section 17.3 item 39 (push -> WhatsApp -> SMS) can be
 * demonstrated under each condition rather than only ever taking the happy
 * path. Session-scoped in-memory flag — there's no real push infrastructure
 * to query a token from yet.
 */
export type PushTokenState = 'VALID' | 'MISSING' | 'UNREGISTERED';

let currentState: PushTokenState = 'VALID';

export function getPushTokenState(): PushTokenState {
  return currentState;
}

export function setPushTokenState(state: PushTokenState): void {
  currentState = state;
}
