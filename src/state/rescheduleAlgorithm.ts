import { getSlotsForDoctorOnDate, type TimeOfDay } from '../data/mockData';

/**
 * Decided v6 — Section 17.3 item 38: alternative slots for a disrupted
 * booking are same doctor/clinic only, never auto-cross-assigned. Offered in
 * this exact order:
 *   1. Next same-day slot — only if the doctor is merely delayed today, not
 *      fully unavailable.
 *   2. Earliest slot on each of the next 2 operating days, in the same
 *      time-of-day window as the original booking.
 *   3. The first available weekend/next-week slot (whichever comes first),
 *      any time-of-day window, as a last resort.
 * If nothing turns up within 7 days, the caller falls back to "View full
 * calendar" / "choose an alternative doctor" instead of slot cards.
 */
export type RescheduleScenario = 'DELAYED_TODAY' | 'UNAVAILABLE';

export type AlternativeSlot = { date: string; time: string };

export type RescheduleResolution = {
  alternatives: AlternativeSlot[];
  exhausted: boolean;
};

const MAX_ALTERNATIVES = 5;
const OPERATING_DAY_SCAN_LIMIT = 10;
const WEEKEND_SCAN_LIMIT = 14;

function parseTimeToMinutes(time: string): number {
  const match = time.match(/^(\d{2}):(\d{2}) (AM|PM)$/);
  if (!match) return 0;
  const [, hourStr, minuteStr, meridiem] = match;
  let hour = Number(hourStr) % 12;
  if (meridiem === 'PM') hour += 12;
  return hour * 60 + Number(minuteStr);
}

function getTimeOfDayBucket(time: string): TimeOfDay {
  const minutes = parseTimeToMinutes(time);
  if (minutes < 12 * 60) return 'Morning';
  if (minutes < 17 * 60) return 'Afternoon';
  return 'Evening';
}

function addDays(dateKey: string, days: number): string {
  const date = new Date(dateKey);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function isWeekend(dateKey: string): boolean {
  const day = new Date(dateKey).getDay();
  return day === 0 || day === 6;
}

function flattenSortedSlots(doctorId: string, dateKey: string): string[] {
  const slots = getSlotsForDoctorOnDate(doctorId, dateKey);
  return [...slots.Morning, ...slots.Afternoon, ...slots.Evening].sort(
    (a, b) => parseTimeToMinutes(a) - parseTimeToMinutes(b),
  );
}

export function resolveRescheduleAlternatives(
  doctorId: string,
  originalDate: string,
  originalTime: string,
  scenario: RescheduleScenario,
  forceExhausted = false,
): RescheduleResolution {
  if (forceExhausted) {
    return { alternatives: [], exhausted: true };
  }

  const alternatives: AlternativeSlot[] = [];
  const originalWindow = getTimeOfDayBucket(originalTime);
  const originalMinutes = parseTimeToMinutes(originalTime);

  // Step 1 — next same-day slot, only if merely delayed (not fully unavailable).
  if (scenario === 'DELAYED_TODAY') {
    const todaySlots = flattenSortedSlots(doctorId, originalDate);
    const nextToday = todaySlots.find((time) => parseTimeToMinutes(time) > originalMinutes);
    if (nextToday) alternatives.push({ date: originalDate, time: nextToday });
  }

  // Step 2 — earliest slot on each of the next 2 operating days, same window.
  let operatingDaysFound = 0;
  let cursor = originalDate;
  let scanned = 0;
  while (operatingDaysFound < 2 && scanned < OPERATING_DAY_SCAN_LIMIT && alternatives.length < MAX_ALTERNATIVES) {
    scanned += 1;
    cursor = addDays(cursor, 1);
    const daySlots = getSlotsForDoctorOnDate(doctorId, cursor);
    const isOperatingDay = daySlots.Morning.length + daySlots.Afternoon.length + daySlots.Evening.length > 0;
    if (!isOperatingDay) continue;
    operatingDaysFound += 1;
    const windowSlots = daySlots[originalWindow];
    if (windowSlots.length > 0) {
      alternatives.push({ date: cursor, time: windowSlots[0] });
    }
  }

  // Step 3 — first available weekend/next-week slot, any window, as a last resort.
  if (alternatives.length < MAX_ALTERNATIVES) {
    const sevenDaysOut = addDays(originalDate, 7);
    let cursor2 = cursor;
    let scanned2 = 0;
    while (scanned2 < WEEKEND_SCAN_LIMIT) {
      scanned2 += 1;
      cursor2 = addDays(cursor2, 1);
      if (!isWeekend(cursor2) && cursor2 < sevenDaysOut) continue;
      const flat = flattenSortedSlots(doctorId, cursor2);
      if (flat.length > 0) {
        alternatives.push({ date: cursor2, time: flat[0] });
        break;
      }
    }
  }

  const capped = alternatives.slice(0, MAX_ALTERNATIVES);
  return { alternatives: capped, exhausted: capped.length === 0 };
}
