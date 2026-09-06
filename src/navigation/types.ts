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
