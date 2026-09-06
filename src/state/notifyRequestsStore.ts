/**
 * Decided v6 — Section 17.3 item 21: "Notify me" requests (Home Feed's area
 * unavailable state, and Slot Selection's no-slots-available state) share one
 * store/dispatch mechanism. A real backend would persist `user_id`,
 * `target_area`, `created_at`, `status`, `notification_token`/`phone_number`
 * and fire an event-driven push/WhatsApp/SMS notification once the area
 * launches or the slot opens. This mock keeps requests in memory for the
 * session and exposes a "dispatch" function a dev control can call to
 * simulate that event firing, so the mechanism is demonstrable end-to-end.
 *
 * Slot-availability requests also feed Module K's waitlist (9.12) once the
 * slot in question frees up — this store is the shared entry point for both.
 */
export type NotifyRequest = {
  id: string;
  createdAt: string;
  status: 'PENDING' | 'NOTIFIED';
} & (
  | { type: 'AREA'; targetArea: string }
  | { type: 'SLOT'; doctorId: string; hospitalId: string; targetDate: string; timePreference: string }
);

let requests: NotifyRequest[] = [];

function makeId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.round(Math.random() * 1000)}`;
}

export function addAreaNotifyRequest(targetArea: string): NotifyRequest {
  const request: NotifyRequest = {
    id: makeId('notify_area'),
    createdAt: new Date().toISOString(),
    status: 'PENDING',
    type: 'AREA',
    targetArea,
  };
  requests = [...requests, request];
  return request;
}

export function addSlotNotifyRequest(params: {
  doctorId: string;
  hospitalId: string;
  targetDate: string;
  timePreference: string;
}): NotifyRequest {
  const request: NotifyRequest = {
    id: makeId('notify_slot'),
    createdAt: new Date().toISOString(),
    status: 'PENDING',
    type: 'SLOT',
    ...params,
  };
  requests = [...requests, request];
  return request;
}

export function getPendingAreaRequests(targetArea: string): NotifyRequest[] {
  return requests.filter((r) => r.type === 'AREA' && r.status === 'PENDING' && r.targetArea === targetArea);
}

export function getPendingSlotRequests(doctorId: string, targetDate: string): NotifyRequest[] {
  return requests.filter(
    (r) => r.type === 'SLOT' && r.status === 'PENDING' && r.doctorId === doctorId && r.targetDate === targetDate,
  );
}

/** Simulates the event-driven dispatch firing once the area is marked available. */
export function dispatchAreaAvailable(targetArea: string): NotifyRequest[] {
  const matches = getPendingAreaRequests(targetArea);
  requests = requests.map((r) => (matches.includes(r) ? { ...r, status: 'NOTIFIED' } : r));
  return matches;
}

/** Simulates the event-driven dispatch firing once slots open for a doctor/date. */
export function dispatchSlotsOpened(doctorId: string, targetDate: string): NotifyRequest[] {
  const matches = getPendingSlotRequests(doctorId, targetDate);
  requests = requests.map((r) => (matches.includes(r) ? { ...r, status: 'NOTIFIED' } : r));
  return matches;
}
