import React, { ReactNode } from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';
import { colors, fonts, fontSizes } from '../theme/tokens';

type TextProps = {
  children: ReactNode;
  style?: TextStyle;
};

export function Heading({ children, style }: TextProps) {
  return <Text style={[styles.heading, style]}>{children}</Text>;
}

export function SubHeading({ children, style }: TextProps) {
  return <Text style={[styles.subHeading, style]}>{children}</Text>;
}

export function Body({ children, style }: TextProps) {
  return <Text style={[styles.body, style]}>{children}</Text>;
}

export function Caption({ children, style }: TextProps) {
  return <Text style={[styles.caption, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  heading: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.h1,
    color: colors.neutralDark,
  },
  subHeading: {
    fontFamily: fonts.heading,
    fontSize: fontSizes.h2,
    color: colors.neutralDark,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: fontSizes.bodyLarge,
    color: colors.neutralDark,
  },
  caption: {
    fontFamily: fonts.body,
    fontSize: fontSizes.caption,
    color: colors.neutralMuted,
  },
});
