import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme/tokens';

type Props = {
  children: ReactNode;
  style?: ViewStyle;
  centered?: boolean;
};

export default function ScreenContainer({ children, style, centered }: Props) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={[styles.container, centered && styles.centered, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
