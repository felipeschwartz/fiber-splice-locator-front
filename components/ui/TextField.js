import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, fontSize, fontWeight, radius, spacing } from '../../theme';

// Campo de formulário padrão: label + input, com o visual (borda,
// raio, cor) definido em um único lugar.
export default function TextField({
  label,
  multiline = false,
  style,
  inputStyle,
  ...inputProps
}) {
  return (
    <View style={style}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.placeholder}
        multiline={multiline}
        style={[styles.input, multiline && styles.multiline, inputStyle]}
        {...inputProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: colors.textSecondary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.extrabold,
    textTransform: 'uppercase',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    minHeight: 48,
    paddingHorizontal: spacing.md,
    color: colors.textTitle,
    fontSize: fontSize.md,
  },
  multiline: {
    minHeight: 120,
    paddingTop: spacing.md,
    textAlignVertical: 'top',
  },
});
