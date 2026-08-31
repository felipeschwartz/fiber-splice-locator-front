import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, fontWeight, radius, spacing, cardShadow } from '../theme';
import { formatAddress } from '../utils/format';
import { getServiceOrderId } from '../utils/serviceOrder';
import StatusBadge from './StatusBadge';

export { getServiceOrderId };

function getOrderTitle(order, displayId) {
  return order?.ceo?.notes || order?.title || order?.description || order?.name || `Ordem #${displayId}`;
}

export default function ServiceOrderCard({ order, onPress }) {
  const id = getServiceOrderId(order);
  const displayId = id ?? '—';
  const title = getOrderTitle(order, displayId);
  const address = formatAddress(order?.ceo?.address || order?.address || order?.location || order?.local);

  const card = (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <StatusBadge status={order?.status} />
      </View>

      <Text style={styles.id}>OS #{displayId}</Text>
      {address ? <Text style={styles.address} numberOfLines={2}>{address}</Text> : null}

      {id !== null ? (
        <Text style={styles.action}>Toque para ver detalhes</Text>
      ) : (
        <Text style={styles.invalid}>Identificador indisponível</Text>
      )}
    </View>
  );

  if (id === null || !onPress) return card;
  return <Pressable onPress={() => onPress(id)}>{card}</Pressable>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...cardShadow,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm + 2,
  },
  title: { color: colors.textTitle, fontSize: fontSize.lg, fontWeight: fontWeight.bold, flex: 1 },
  id: { color: colors.textMuted, fontSize: fontSize.base, marginTop: spacing.sm },
  address: { color: colors.textSecondary, fontSize: fontSize.md, marginTop: spacing.sm },
  action: { color: colors.primary, fontSize: fontSize.sm, fontWeight: fontWeight.bold, marginTop: spacing.md },
  invalid: { color: colors.warningText, fontSize: fontSize.sm, marginTop: spacing.md },
});
