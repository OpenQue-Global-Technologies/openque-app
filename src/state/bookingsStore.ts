import AsyncStorage from '@react-native-async-storage/async-storage';
import { getQueueState, setQueueState, type QueueState } from './queueStore';

/**
 * Local/mock bookings store — no backend yet. Booking Confirmation writes
 * here so the Bookings tab (and Home's "Your Upcoming Appointment" card) can
 * read real data. Persisted to AsyncStorage so a booking survives a page
 * reload during manual testing.
 */
export type BookingStatus = 'CONFIRMED' | 'CANCELLED';

export type Booking = {
  id: string;
  doctorId: string;
  hospitalId: string;
  date: string; // ISO date, e.g. 2026-09-10
  time: string; // e.g. "10:30 AM"
  feeInr: number;
  status: BookingStatus;
  wasRescheduled: boolean;
  createdAt: string;
};

export type BookingStatusTag = 'Confirmed' | 'Rescheduled' | 'Completed' | 'Cancelled' | 'No-show';

const STORAGE_KEY = 'openque.mockBookings';

// Section 6.2: once a booking reaches one of these queue states it belongs on
// the Past list regardless of its own CONFIRMED status.
const TERMINAL_QUEUE_STATES: QueueState[] = ['COMPLETED', 'NO_SHOW'];

let cachedBookings: Booking[] | null = null;

async function loadBookings(): Promise<Booking[]> {
  if (cachedBookings) return cachedBookings;
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    cachedBookings = raw ? (JSON.parse(raw) as Booking[]) : [];
  } catch {
    cachedBookings = [];
  }
  return cachedBookings;
}

async function persist(bookings: Booking[]): Promise<void> {
  cachedBookings = bookings;
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  } catch {
    // best-effort — in-memory cache still reflects the write this session
  }
}

async function attachQueueStates(
  bookings: Booking[],
): Promise<{ booking: Booking; queueState: QueueState }[]> {
  return Promise.all(
    bookings.map(async (booking) => ({ booking, queueState: await getQueueState(booking.id) })),
  );
}

export function isBookingUpcoming(booking: Booking, queueState: QueueState): boolean {
  return booking.status === 'CONFIRMED' && !TERMINAL_QUEUE_STATES.includes(queueState);
}

export function computeStatusTag(booking: Booking, queueState: QueueState): BookingStatusTag {
  if (booking.status === 'CANCELLED') return 'Cancelled';
  if (queueState === 'COMPLETED') return 'Completed';
  if (queueState === 'NO_SHOW') return 'No-show';
  if (booking.wasRescheduled) return 'Rescheduled';
  return 'Confirmed';
}

export async function getBookingStatusTag(booking: Booking): Promise<BookingStatusTag> {
  const queueState = await getQueueState(booking.id);
  return computeStatusTag(booking, queueState);
}

export async function addBooking(
  input: Omit<Booking, 'id' | 'status' | 'wasRescheduled' | 'createdAt'>,
): Promise<Booking> {
  const bookings = await loadBookings();
  const booking: Booking = {
    ...input,
    id: `bk_${Date.now()}`,
    status: 'CONFIRMED',
    wasRescheduled: false,
    createdAt: new Date().toISOString(),
  };
  await persist([...bookings, booking]);
  return booking;
}

export async function getUpcomingBookings(): Promise<Booking[]> {
  const bookings = await loadBookings();
  const withState = await attachQueueStates(bookings);
  return withState
    .filter(({ booking, queueState }) => isBookingUpcoming(booking, queueState))
    .map(({ booking }) => booking)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export async function getUpcomingBooking(): Promise<Booking | null> {
  const upcoming = await getUpcomingBookings();
  return upcoming[0] ?? null;
}

export async function getPastBookings(): Promise<Booking[]> {
  const bookings = await loadBookings();
  const withState = await attachQueueStates(bookings);
  return withState
    .filter(({ booking, queueState }) => !isBookingUpcoming(booking, queueState))
    .map(({ booking }) => booking)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getBookingById(bookingId: string): Promise<Booking | null> {
  const bookings = await loadBookings();
  return bookings.find((booking) => booking.id === bookingId) ?? null;
}

export async function getAllBookings(): Promise<Booking[]> {
  return loadBookings();
}

/** Called after Delete Account wipes storage, so a fresh signup this same session re-reads defaults. */
export function resetBookingsCache(): void {
  cachedBookings = null;
}

/**
 * Module C (9.4) — Cancellation Handling, simplified for cash-only Scale 1:
 * releasing the slot has no payment/refund side effect, so it reduces to
 * marking the booking CANCELLED (mock slots are generated on demand from
 * doctor/date, not held as reserved inventory).
 */
export async function cancelBooking(bookingId: string): Promise<void> {
  const bookings = await loadBookings();
  const updated = bookings.map((booking) =>
    booking.id === bookingId ? { ...booking, status: 'CANCELLED' as const } : booking,
  );
  await persist(updated);
}

export async function rescheduleBooking(
  bookingId: string,
  next: { date: string; time: string },
): Promise<Booking | null> {
  const bookings = await loadBookings();
  let updatedBooking: Booking | null = null;
  const updated = bookings.map((booking) => {
    if (booking.id !== bookingId) return booking;
    updatedBooking = { ...booking, date: next.date, time: next.time, wasRescheduled: true };
    return updatedBooking;
  });
  if (updatedBooking) {
    await persist(updated);
    await setQueueState(bookingId, 'BOOKED');
  }
  return updatedBooking;
}
