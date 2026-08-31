import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fontSize, fontWeight, radius, spacing } from '../../theme';

// Pílula de seleção usada em filtros, toggles Sim/Não e grades de status.
export default function Chip({ label, active, onPress, style }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive, style]}>
      <Text style={[styles.text, active && styles.textActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  chipActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primary,
  },
  text: {
    fontSize: fontSize.base,
    color: colors.textSecondary,
    fontWeight: fontWeight.bold,
  },
  textActive: { color: colors.primaryDark },
});
