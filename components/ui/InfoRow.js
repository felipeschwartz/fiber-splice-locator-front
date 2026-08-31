import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, fontWeight, spacing } from '../../theme';
import { displayValue } from '../../utils/format';

// Linha "rótulo em cima / valor embaixo" usada nas telas de detalhe
// (Ordem de Serviço e CEO).
export default function InfoRow({ label, value, bordered = true }) {
  return (
    <View style={[styles.row, bordered && styles.bordered]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{displayValue(value)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { paddingVertical: spacing.md },
  bordered: { borderBottomWidth: 1, borderBottomColor: colors.borderSoft },
  label: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.extrabold,
    textTransform: 'uppercase',
  },
  value: { color: colors.textBody, fontSize: fontSize.md, marginTop: spacing.xs },
});
