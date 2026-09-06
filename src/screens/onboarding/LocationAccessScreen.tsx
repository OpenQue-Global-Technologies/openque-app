import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import type { RootStackParamList } from '../../navigation/types';
import ScreenContainer from '../../components/ScreenContainer';
import { Heading, Body } from '../../components/Typography';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryLink from '../../components/SecondaryLink';
import { colors, spacing } from '../../theme/tokens';
import { requestLocationPermission } from '../../state/locationPermission';

type Props = NativeStackScreenProps<RootStackParamList, 'LocationAccess'>;

export default function LocationAccessScreen({ navigation }: Props) {
  const [isRequesting, setIsRequesting] = useState(false);

  const handleAllowAccess = async () => {
    setIsRequesting(true);
    await requestLocationPermission();
    setIsRequesting(false);
    navigation.replace('NotificationAccess');
  };

  return (
    <ScreenContainer centered>
      <View style={styles.iconCircle}>
        <Ionicons name="location" size={56} color={colors.primary} />
      </View>
      <Heading style={styles.heading}>Enable location access</Heading>
      <Body style={styles.body}>Discover nearby hospitals around you.</Body>

      <View style={styles.actions}>
        <PrimaryButton label="Allow access" onPress={handleAllowAccess} loading={isRequesting} />
        <SecondaryLink
          label="Enter location manually"
          onPress={() => navigation.navigate('EnterLocationManually')}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  heading: {
    textAlign: 'center',
  },
  body: {
    textAlign: 'center',
    color: colors.neutralMuted,
    marginTop: spacing.sm,
  },
  actions: {
    width: '100%',
    gap: spacing.lg,
    alignItems: 'center',
    marginTop: spacing.xxxl,
  },
});
