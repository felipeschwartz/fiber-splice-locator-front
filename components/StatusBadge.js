import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, fontWeight, radius, spacing } from '../theme';

export const SERVICE_ORDER_STATUS_META = {
  OPEN: { label: 'Aberta', color: colors.primary, background: colors.primarySoft, icon: '○' },
  IN_PROGRESS: { label: 'Em andamento', color: colors.warning, background: colors.warningBg, icon: '◷' },
  COMPLETED: { label: 'Concluída', color: colors.success, background: colors.successBg, icon: '✓' },
  CANCELLED: { label: 'Cancelada', color: colors.dangerTextStrong, background: colors.dangerBg, icon: '×' },
};

const FALLBACK_META = { color: colors.textSecondary, background: colors.borderSoft, icon: '•' };

export default function StatusBadge({ status, large = false }) {
  const normalized = String(status || '').toUpperCase();
  const meta = SERVICE_ORDER_STATUS_META[normalized] || { ...FALLBACK_META, label: status || 'Sem status' };

  return (
    <View style={[styles.badge, large && styles.badgeLarge, { backgroundColor: meta.background }]}>
      <Text style={[styles.icon, large && styles.textLarge, { color: meta.color }]}>{meta.icon}</Text>
      <Text style={[styles.label, large && styles.textLarge, { color: meta.color }]}>{meta.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md - 2,
    paddingVertical: spacing.xs + 1,
    alignSelf: 'flex-start',
  },
  badgeLarge: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm - 1 },
  icon: { fontSize: fontSize.base, fontWeight: fontWeight.extrabold },
  label: { fontSize: fontSize.sm, fontWeight: fontWeight.bold },
  textLarge: { fontSize: fontSize.base + 1 },
});
