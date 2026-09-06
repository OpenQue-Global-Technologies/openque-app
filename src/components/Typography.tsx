import React from 'react';
import { Text, TextProps as RNTextProps } from 'react-native';
import { colors, fonts, fontSizes } from '../theme/tokens';
import { StyleSheet } from 'react-native';

type TextProps = RNTextProps;

export function Heading({ style, ...props }: TextProps) {
  return <Text style={[styles.heading, style]} {...props} />;
}

export function SubHeading({ style, ...props }: TextProps) {
  return <Text style={[styles.subHeading, style]} {...props} />;
}

export function Body({ style, ...props }: TextProps) {
  return <Text style={[styles.body, style]} {...props} />;
}

export function Caption({ style, ...props }: TextProps) {
  return <Text style={[styles.caption, style]} {...props} />;
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
