import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors, fontSize, fontWeight, radius, spacing } from '../../theme';

const VARIANTS = {
  primary: {
    base: { backgroundColor: colors.primary, borderWidth: 0 },
    text: { color: colors.white },
    indicator: colors.white,
  },
  outline: {
    base: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.border },
    text: { color: colors.textSecondary },
    indicator: colors.primary,
  },
  outlinePrimary: {
    base: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary },
    text: { color: colors.primary },
    indicator: colors.primary,
  },
  outlineDanger: {
    base: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.dangerBorder },
    text: { color: colors.dangerTextStrong },
    indicator: colors.dangerTextStrong,
  },
  outlineOnDark: {
    base: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.onDarkEyebrow },
    text: { color: colors.onDarkLink },
    indicator: colors.onDarkLink,
  },
};

// Botão único para todo o app: troque só a `variant` em vez de recriar
// estilo de botão em cada tela.
export default function Button({
  label,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) {
  const { base, text, indicator } = VARIANTS[variant] || VARIANTS.primary;
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        base,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? <ActivityIndicator color={indicator} /> : <Text style={[styles.text, text, textStyle]}>{label}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  text: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.extrabold,
  },
  pressed: { opacity: 0.85 },
  disabled: { opacity: 0.55 },
});
