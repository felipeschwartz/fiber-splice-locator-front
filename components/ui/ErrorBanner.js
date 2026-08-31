import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors, fontSize, radius, spacing } from '../../theme';

export default function ErrorBanner({ message, style }) {
  if (!message) return null;
  return <Text style={[styles.banner, style]}>{message}</Text>;
}

const styles = StyleSheet.create({
  banner: {
    color: colors.dangerText,
    backgroundColor: colors.dangerBg,
    padding: spacing.md,
    borderRadius: radius.md,
    fontSize: fontSize.md,
  },
});
