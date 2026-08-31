import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fontSize, fontWeight, radius, spacing } from '../../theme';

// Botão de navegação em formato de ícone + rótulo embaixo, usado na
// grade de atalhos da tela inicial (Ordens de serviço / CEOs / Usuários).
export default function IconTile({ icon, label, onPress, style }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.tile, pressed && styles.pressed, style]}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={26} color={colors.onDarkTitle} />
      </View>
      <Text style={styles.label} numberOfLines={2}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: { flex: 1, alignItems: 'center' },
  pressed: { opacity: 0.75 },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: radius.xxl + 10,
    backgroundColor: colors.overlayOnDark,
    borderWidth: 1,
    borderColor: colors.onDarkEyebrow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm + 2,
  },
  label: {
    color: colors.onDarkBody,
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    textAlign: 'center',
  },
});
