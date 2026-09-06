import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Local/mock bookings store — no backend yet. Booking Confirmation writes
 * here so a later phase's Bookings tab (and Home's "Your Upcoming
 * Appointment" card) can read real data. Persisted to AsyncStorage so a
 * booking survives a page reload during manual testing.
 */
export type Booking = {
  id: string;
  doctorId: string;
  hospitalId: string;
  date: string; // ISO date, e.g. 2026-09-10
  time: string; // e.g. "10:30 AM"
  feeInr: number;
  status: 'CONFIRMED';
  createdAt: string;
};

const STORAGE_KEY = 'openque.mockBookings';

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

export async function addBooking(
  input: Omit<Booking, 'id' | 'status' | 'createdAt'>,
): Promise<Booking> {
  const bookings = await loadBookings();
  const booking: Booking = {
    ...input,
    id: `bk_${Date.now()}`,
    status: 'CONFIRMED',
    createdAt: new Date().toISOString(),
  };
  await persist([...bookings, booking]);
  return booking;
}

export async function getUpcomingBooking(): Promise<Booking | null> {
  const bookings = await loadBookings();
  if (bookings.length === 0) return null;
  return [...bookings].sort((a, b) => a.date.localeCompare(b.date))[0];
}

export async function getBookingById(bookingId: string): Promise<Booking | null> {
  const bookings = await loadBookings();
  return bookings.find((booking) => booking.id === bookingId) ?? null;
}

export async function getAllBookings(): Promise<Booking[]> {
  return loadBookings();
}
