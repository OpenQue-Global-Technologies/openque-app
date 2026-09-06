import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../navigation/types';
import { colors, fonts, fontSizes } from '../../theme/tokens';
import { getHasExistingSession } from '../../state/session';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const AUTO_ADVANCE_MS = 2000;

export default function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    let isActive = true;

    const timer = setTimeout(async () => {
      const hasExistingSession = await getHasExistingSession();
      if (!isActive) return;

      if (hasExistingSession) {
        navigation.replace('Home');
      } else {
        navigation.replace('WelcomeCarousel');
      }
    }, AUTO_ADVANCE_MS);

    return () => {
      isActive = false;
      clearTimeout(timer);
    };
  }, [navigation]);

  return (
    <LinearGradient
      colors={[colors.primary, colors.secondary]}
      style={styles.container}
      testID="splash-gradient"
    >
      <Text style={styles.logo}>OpenQue</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.display,
    color: colors.white,
  },
});
