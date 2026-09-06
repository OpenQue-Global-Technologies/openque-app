/**
 * Hardcoded mock catalogue — no backend exists yet for Phase 2. Slot
 * generation is deterministic per doctor/date so the happy-path demo never
 * hits the "No Slots Available" state (out of scope this phase).
 */

export type Specialty =
  | 'General Physician'
  | 'Cardiology'
  | 'Dermatology'
  | 'Orthopedics'
  | 'Pediatrics'
  | 'ENT'
  | 'Gynecology'
  | 'Dentistry';

export const SPECIALTIES: Specialty[] = [
  'General Physician',
  'Cardiology',
  'Dermatology',
  'Orthopedics',
  'Pediatrics',
  'ENT',
  'Gynecology',
  'Dentistry',
];

export type Hospital = {
  id: string;
  name: string;
  address: string;
  rating: number;
  distanceKm: number;
  specialties: Specialty[];
  about: string;
};

export type Doctor = {
  id: string;
  hospitalId: string;
  name: string;
  qualifications: string;
  specialty: Specialty;
  yearsExperience: number;
  feeInr: number;
};

export const HOSPITALS: Hospital[] = [
  {
    id: 'h1',
    name: 'Sunrise Multispecialty Hospital',
    address: 'Anna Nagar, Chennai',
    rating: 4.5,
    distanceKm: 2.1,
    specialties: ['General Physician', 'Cardiology', 'Orthopedics', 'Pediatrics'],
    about:
      'Sunrise Multispecialty Hospital has served Anna Nagar for over 20 years, offering round-the-clock emergency care and a full range of outpatient specialties.',
  },
  {
    id: 'h2',
    name: 'Lakeview Medical Centre',
    address: 'Koramangala, Bengaluru',
    rating: 4.7,
    distanceKm: 3.4,
    specialties: ['Dermatology', 'Gynecology', 'ENT', 'General Physician'],
    about:
      'Lakeview Medical Centre is a boutique clinic network known for short wait times and a patient-first approach across its dermatology and ENT departments.',
  },
  {
    id: 'h3',
    name: 'Cityline Dental & Ortho Clinic',
    address: 'Andheri West, Mumbai',
    rating: 4.3,
    distanceKm: 1.6,
    specialties: ['Dentistry', 'Orthopedics'],
    about:
      'Cityline Dental & Ortho Clinic specializes in restorative dentistry and joint care, with in-house imaging to avoid repeat visits.',
  },
  {
    id: 'h4',
    name: 'Green Cross Hospital',
    address: 'Banjara Hills, Hyderabad',
    rating: 4.6,
    distanceKm: 4.8,
    specialties: ['Cardiology', 'General Physician', 'Pediatrics'],
    about:
      'Green Cross Hospital runs a dedicated cardiac care unit alongside general and pediatric outpatient departments.',
  },
];

export const DOCTORS: Doctor[] = [
  {
    id: 'd1',
    hospitalId: 'h1',
    name: 'Dr. Aditi Rao',
    qualifications: 'MBBS, MD (General Medicine)',
    specialty: 'General Physician',
    yearsExperience: 12,
    feeInr: 500,
  },
  {
    id: 'd2',
    hospitalId: 'h1',
    name: 'Dr. Karthik Subramaniam',
    qualifications: 'MBBS, DM (Cardiology)',
    specialty: 'Cardiology',
    yearsExperience: 15,
    feeInr: 900,
  },
  {
    id: 'd3',
    hospitalId: 'h1',
    name: 'Dr. Priya Menon',
    qualifications: 'MBBS, MS (Orthopedics)',
    specialty: 'Orthopedics',
    yearsExperience: 9,
    feeInr: 700,
  },
  {
    id: 'd4',
    hospitalId: 'h2',
    name: 'Dr. Sneha Bhat',
    qualifications: 'MBBS, MD (Dermatology)',
    specialty: 'Dermatology',
    yearsExperience: 8,
    feeInr: 650,
  },
  {
    id: 'd5',
    hospitalId: 'h2',
    name: 'Dr. Farah Sheikh',
    qualifications: 'MBBS, DGO',
    specialty: 'Gynecology',
    yearsExperience: 11,
    feeInr: 750,
  },
  {
    id: 'd6',
    hospitalId: 'h2',
    name: 'Dr. Rohan Kulkarni',
    qualifications: 'MBBS, MS (ENT)',
    specialty: 'ENT',
    yearsExperience: 6,
    feeInr: 550,
  },
  {
    id: 'd7',
    hospitalId: 'h3',
    name: 'Dr. Vivek Nair',
    qualifications: 'BDS, MDS (Orthodontics)',
    specialty: 'Dentistry',
    yearsExperience: 7,
    feeInr: 400,
  },
  {
    id: 'd8',
    hospitalId: 'h4',
    name: 'Dr. Meera Reddy',
    qualifications: 'MBBS, DM (Cardiology)',
    specialty: 'Cardiology',
    yearsExperience: 18,
    feeInr: 1000,
  },
  {
    id: 'd9',
    hospitalId: 'h4',
    name: 'Dr. Arjun Iyer',
    qualifications: 'MBBS, MD (Pediatrics)',
    specialty: 'Pediatrics',
    yearsExperience: 10,
    feeInr: 600,
  },
];

export function getHospitalById(hospitalId: string): Hospital | undefined {
  return HOSPITALS.find((hospital) => hospital.id === hospitalId);
}

export function getDoctorById(doctorId: string): Doctor | undefined {
  return DOCTORS.find((doctor) => doctor.id === doctorId);
}

export function getDoctorsByHospital(hospitalId: string): Doctor[] {
  return DOCTORS.filter((doctor) => doctor.hospitalId === hospitalId);
}

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function firstSlotToday(doctorId: string): string | null {
  const slots = getSlotsForDoctorOnDate(doctorId, toDateKey(new Date()));
  return slots.Morning[0] ?? slots.Afternoon[0] ?? slots.Evening[0] ?? null;
}

export type HospitalSearchMeta = {
  matchedSpecialtyLabel: string;
  startingFeeInr: number;
  nextSlotLabel: string;
};

/**
 * Aggregates per-doctor attributes (fee, next slot) up to hospital level for
 * the Search Results list, optionally scoped to one specialty.
 */
export function getHospitalSearchMeta(
  hospitalId: string,
  specialtyFilter?: Specialty,
): HospitalSearchMeta | null {
  const doctors = getDoctorsByHospital(hospitalId).filter(
    (doctor) => !specialtyFilter || doctor.specialty === specialtyFilter,
  );
  if (doctors.length === 0) return null;

  const cheapest = doctors.reduce((min, doctor) => (doctor.feeInr < min.feeInr ? doctor : min));
  const nextSlot = firstSlotToday(cheapest.id);

  return {
    matchedSpecialtyLabel: specialtyFilter ?? cheapest.specialty,
    startingFeeInr: cheapest.feeInr,
    nextSlotLabel: nextSlot ? `Today, ${nextSlot}` : 'See available slots',
  };
}

export type TimeOfDay = 'Morning' | 'Afternoon' | 'Evening';

export type DaySlots = Record<TimeOfDay, string[]>;

const TIME_TEMPLATES: Record<TimeOfDay, string[]> = {
  Morning: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM'],
  Afternoon: ['12:00 PM', '12:30 PM', '01:00 PM', '02:00 PM'],
  Evening: ['05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM'],
};

/**
 * Deterministic pseudo-random slot availability, seeded by doctor id + date,
 * so the same doctor/date always shows the same slots during a session.
 * Each time-of-day bucket always keeps at least one slot — the "No Slots
 * Available" state is out of scope this phase, so the happy path must never
 * land there.
 */
export function getSlotsForDoctorOnDate(doctorId: string, dateKey: string): DaySlots {
  const seedBase = `${doctorId}-${dateKey}`;

  const pick = (values: string[], seedSuffix: string): string[] => {
    let hash = 0;
    const seed = seedBase + seedSuffix;
    for (let i = 0; i < seed.length; i += 1) {
      hash = (hash * 31 + seed.charCodeAt(i)) % 1000;
    }
    const filtered = values.filter((_, index) => (hash + index) % 3 !== 0);
    return filtered.length > 0 ? filtered : [values[hash % values.length]];
  };

  return {
    Morning: pick(TIME_TEMPLATES.Morning, 'morning'),
    Afternoon: pick(TIME_TEMPLATES.Afternoon, 'afternoon'),
    Evening: pick(TIME_TEMPLATES.Evening, 'evening'),
  };
}
