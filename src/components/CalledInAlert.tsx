import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import PrimaryButton from './PrimaryButton';
import { Body, Heading } from './Typography';
import { colors, spacing } from '../theme/tokens';

type Props = {
  visible: boolean;
  doctorName: string;
  onDismiss: () => void;
};

export default function CalledInAlert({ visible, doctorName, onDismiss }: Props) {
  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onDismiss}>
      <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.container}>
        <Heading style={styles.heading}>It&apos;s your turn!</Heading>
        <Body style={styles.body}>Please proceed to {doctorName}&apos;s room now.</Body>

        <View style={styles.action}>
          <PrimaryButton label="Got it" onPress={onDismiss} inverted />
        </View>
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxxl,
  },
  heading: {
    color: colors.white,
    textAlign: 'center',
  },
  body: {
    color: colors.white,
    textAlign: 'center',
    marginTop: spacing.md,
  },
  action: {
    width: '100%',
    marginTop: spacing.xxxl,
  },
});
