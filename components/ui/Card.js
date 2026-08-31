import React from 'react';
import { StyleSheet, View } from 'react-native';
import { cardShadow, colors, radius, spacing } from '../../theme';

export default function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    ...cardShadow,
  },
});
