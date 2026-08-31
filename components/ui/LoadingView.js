import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, spacing } from '../../theme';

export default function LoadingView({ label, fill = true }) {
  return (
    <View style={[styles.center, fill && styles.fill]}>
      <ActivityIndicator size="large" color={colors.primary} />
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center', padding: spacing.xxl },
  label: { color: colors.textMuted, marginTop: spacing.sm, fontSize: fontSize.md },
});
