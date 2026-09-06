import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import SplashScreen from '../screens/onboarding/SplashScreen';
import WelcomeCarouselScreen from '../screens/onboarding/WelcomeCarouselScreen';
import LoginScreen from '../screens/onboarding/LoginScreen';
import SignupScreen from '../screens/onboarding/SignupScreen';
import OtpVerificationScreen from '../screens/onboarding/OtpVerificationScreen';
import OtpVerifiedScreen from '../screens/onboarding/OtpVerifiedScreen';
import LocationAccessScreen from '../screens/onboarding/LocationAccessScreen';
import EnterLocationManuallyScreen from '../screens/onboarding/EnterLocationManuallyScreen';
import NotificationAccessScreen from '../screens/onboarding/NotificationAccessScreen';
import NotificationPreviouslyDeniedScreen from '../screens/onboarding/NotificationPreviouslyDeniedScreen';
import ProfileDetailsScreen from '../screens/onboarding/ProfileDetailsScreen';
import MainTabNavigator from './MainTabNavigator';
import { colors } from '../theme/tokens';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="WelcomeCarousel" component={WelcomeCarouselScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
      <Stack.Screen name="OtpVerified" component={OtpVerifiedScreen} />
      <Stack.Screen name="LocationAccess" component={LocationAccessScreen} />
      <Stack.Screen name="EnterLocationManually" component={EnterLocationManuallyScreen} />
      <Stack.Screen name="NotificationAccess" component={NotificationAccessScreen} />
      <Stack.Screen
        name="NotificationPreviouslyDenied"
        component={NotificationPreviouslyDeniedScreen}
      />
      <Stack.Screen name="ProfileDetails" component={ProfileDetailsScreen} />
      <Stack.Screen name="Home" component={MainTabNavigator} />
    </Stack.Navigator>
  );
}
