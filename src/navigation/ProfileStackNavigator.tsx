import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from './types';
import ProfileMainScreen from '../screens/profile/ProfileMainScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import ChangePhoneNumberScreen from '../screens/profile/ChangePhoneNumberScreen';
import ChangePhoneOtpScreen from '../screens/profile/ChangePhoneOtpScreen';
import NotificationPreferencesScreen from '../screens/profile/NotificationPreferencesScreen';
import LanguageToggleScreen from '../screens/profile/LanguageToggleScreen';
import HelpFaqScreen from '../screens/profile/HelpFaqScreen';
import ContactSupportScreen from '../screens/profile/ContactSupportScreen';
import PrivacySettingsScreen from '../screens/profile/PrivacySettingsScreen';
import GrievanceSubmissionScreen from '../screens/profile/GrievanceSubmissionScreen';
import DeleteAccountScreen from '../screens/profile/DeleteAccountScreen';
import DeleteAccountOtpScreen from '../screens/profile/DeleteAccountOtpScreen';
import DeleteAccountConfirmationScreen from '../screens/profile/DeleteAccountConfirmationScreen';
import { colors } from '../theme/tokens';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="ProfileMain"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="ProfileMain" component={ProfileMainScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ChangePhoneNumber" component={ChangePhoneNumberScreen} />
      <Stack.Screen name="ChangePhoneOtp" component={ChangePhoneOtpScreen} />
      <Stack.Screen name="NotificationPreferences" component={NotificationPreferencesScreen} />
      <Stack.Screen name="LanguageToggle" component={LanguageToggleScreen} />
      <Stack.Screen name="HelpFaq" component={HelpFaqScreen} />
      <Stack.Screen name="ContactSupport" component={ContactSupportScreen} />
      <Stack.Screen name="PrivacySettings" component={PrivacySettingsScreen} />
      <Stack.Screen name="GrievanceSubmission" component={GrievanceSubmissionScreen} />
      <Stack.Screen name="DeleteAccount" component={DeleteAccountScreen} />
      <Stack.Screen name="DeleteAccountOtp" component={DeleteAccountOtpScreen} />
      <Stack.Screen name="DeleteAccountConfirmation" component={DeleteAccountConfirmationScreen} />
    </Stack.Navigator>
  );
}
