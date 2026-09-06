export type Language = 'en' | 'ta';

/**
 * A handful of strings, not a full translation pass — enough to prove the
 * Language Toggle mechanism actually changes rendered UI (Section 6.2
 * "Language Toggle"). Applied to the tab bar and the Profile section, which
 * stay visible/reachable regardless of language so the effect is easy to see.
 */
export const translations = {
  en: {
    tabHome: 'Home',
    tabBookings: 'Bookings',
    tabQueue: 'Queue',
    tabProfile: 'Profile',
    profileTitle: 'Profile',
    menuEditProfile: 'Edit Profile',
    menuNotificationPreferences: 'Notification Preferences',
    menuLanguage: 'Language',
    menuHelpFaq: 'Help & FAQ',
    menuPrivacySettings: 'Privacy Settings',
    menuGrievance: 'Grievance',
    menuDeleteAccount: 'Delete Account',
    menuLogout: 'Logout',
  },
  ta: {
    tabHome: 'முகப்பு',
    tabBookings: 'முன்பதிவுகள்',
    tabQueue: 'வரிசை',
    tabProfile: 'சுயவிவரம்',
    profileTitle: 'சுயவிவரம்',
    menuEditProfile: 'சுயவிவரத்தைத் திருத்து',
    menuNotificationPreferences: 'அறிவிப்பு விருப்பங்கள்',
    menuLanguage: 'மொழி',
    menuHelpFaq: 'உதவி & கேள்விகள்',
    menuPrivacySettings: 'தனியுரிமை அமைப்புகள்',
    menuGrievance: 'குறை தீர்வு',
    menuDeleteAccount: 'கணக்கை நீக்கு',
    menuLogout: 'வெளியேறு',
  },
} as const;

export type TranslationKey = keyof (typeof translations)['en'];
