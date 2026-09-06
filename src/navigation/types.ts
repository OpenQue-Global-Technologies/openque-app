import type { NavigatorScreenParams } from '@react-navigation/native';
import type { Specialty } from '../data/mockData';

export type AuthEntryPoint = 'carousel' | 'direct';

export type RootStackParamList = {
  Splash: undefined;
  WelcomeCarousel: undefined;
  Login: { entryPoint: AuthEntryPoint };
  Signup: undefined;
  OtpVerification: { phoneNumber: string; from: 'login' | 'signup' };
  OtpVerified: { phoneNumber: string };
  LocationAccess: undefined;
  EnterLocationManually: undefined;
  NotificationAccess: undefined;
  NotificationPreviouslyDenied: undefined;
  ProfileDetails: undefined;
  Home: undefined;
};

export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList> | undefined;
  BookingsTab: NavigatorScreenParams<BookingsStackParamList> | undefined;
  QueueTab: undefined;
  ProfileTab: undefined;
};

export type HomeStackParamList = {
  HomeFeed: undefined;
  SearchResults: { initialQuery?: string; initialSpecialty?: Specialty } | undefined;
  HospitalProfile: { hospitalId: string };
  DoctorProfile: { doctorId: string };
  SlotSelectionCalendar: { doctorId: string };
  SlotSelectionTimeGrid: { doctorId: string; date: string };
  BookingSummary: { doctorId: string; date: string; time: string };
  BookingConfirmation: { bookingId: string };
};

export type BookingsStackParamList = {
  BookingsList: undefined;
  AppointmentDetail: { bookingId: string };
  RescheduleCalendar: { bookingId: string; doctorId: string };
  RescheduleTimeGrid: { bookingId: string; doctorId: string; date: string };
  RescheduleConfirm: { bookingId: string; doctorId: string; date: string; time: string };
  CancelConfirmation: { bookingId: string };
};
