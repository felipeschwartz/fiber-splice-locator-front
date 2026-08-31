import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, fontWeight, spacing } from '../../theme';
import Card from './Card';

// Card com título de seção — usado para agrupar blocos como
// "Informações da ordem", "Fotos anexadas", "Novo status", etc.
export default function SectionCard({ title, right, children, style }) {
  return (
    <Card style={[styles.card, style]}>
      {title ? (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {right}
        </View>
      ) : null}
      {children}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: spacing.lg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    color: colors.textTitle,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.extrabold,
  },
});
