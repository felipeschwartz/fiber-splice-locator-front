import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { getApiErrorMessage } from '../services/api';
import { getServiceOrder } from '../services/serviceOrderService';
import { listServiceOrderPhotos } from '../services/serviceOrderPhotoService';
import { listServiceOrderStatusDescriptions } from '../services/serviceOrderStatusDescriptionService';
import { displayValue, firstValue, formatAddress, formatDateTime, resolveGeolocation } from '../utils/format';
import { NEXT_STATUS_BY_CURRENT } from '../utils/serviceOrder';
import StatusBadge from '../components/StatusBadge';
import CameraCapture from '../components/CameraCapture';
import { Button, ErrorBanner, GeoRow, HeroHeader, InfoRow, LoadingView, Screen, SectionCard } from '../components/ui';
import { colors, fontSize, fontWeight, radius, spacing } from '../theme';

const TERMINAL_STATUSES = ['COMPLETED', 'CANCELLED'];

function photoUri(photo) {
  return typeof photo === 'string' ? photo : firstValue(photo, 'url', 'uri', 'fileUrl', 'path', 'imageUrl');
}

export default function ServiceOrderDetailScreen({ route, navigation }) {
  const { order: initialOrder, serviceOrderId } = route?.params || {};
  const id = serviceOrderId ?? initialOrder?.serviceOrderId ?? initialOrder?.id ?? initialOrder?.orderId;
  const { logout } = useAuth();

  const [order, setOrder] = useState(initialOrder || null);
  const [photos, setPhotos] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (id === null || id === undefined || id === '') {
      setError('Identificador da ordem inválido.');
      setLoading(false);
      return;
    }

    setError('');
    setLoading(true);

    try {
      const [orderData, photoData, historyData] = await Promise.all([
        getServiceOrder(id),
        listServiceOrderPhotos(id),
        listServiceOrderStatusDescriptions(id),
      ]);
      setOrder(orderData);
      setPhotos(photoData);
      setHistory(historyData);
    } catch (err) {
      if (err.response?.status === 401) await logout();
      else setError(getApiErrorMessage(err, 'Não foi possível carregar os dados da ordem.'));
    } finally {
      setLoading(false);
    }
  }, [id, logout]);

  useEffect(() => {
    load();
  }, [load]);

  const status = firstValue(order, 'status', 'orderStatus');
  const normalizedStatus = String(status || '').toUpperCase();
  const nextStatus = NEXT_STATUS_BY_CURRENT[normalizedStatus];
  const isTerminal = TERMINAL_STATUSES.includes(normalizedStatus);
  const actionLabel = nextStatus === 'IN_PROGRESS' ? 'Iniciar atendimento' : 'Registrar atendimento';

  function openAttendance() {
    navigation.navigate('ServiceOrderAttendance', { order, serviceOrderId: id });
  }

  function cancelOrder() {
    Alert.alert('Cancelar ordem?', 'Essa ação não pode ser desfeita.', [
      { text: 'Voltar', style: 'cancel' },
      {
        text: 'Cancelar ordem',
        style: 'destructive',
        onPress: () => navigation.navigate('ServiceOrderAttendance', { order, serviceOrderId: id, initialStatus: 'CANCELLED' }),
      },
    ]);
  }

  if (loading) {
    return (
      <Screen>
        <LoadingView label="Carregando ordem..." />
      </Screen>
    );
  }

  if (error && !order) {
    return (
      <Screen>
        <View style={styles.centerState}>
          <ErrorBanner message={error} style={styles.centerError} />
          <Button label="Tentar novamente" onPress={load} style={styles.retryButton} />
        </View>
      </Screen>
    );
  }

  const ceo = order?.ceo || {};
  const address = ceo.address || {};
  const displayId = firstValue(order, 'serviceOrderId') ?? id;
  const displayedPhotos = photos.length ? photos : Array.isArray(order?.serviceOrderPhotos) ? order.serviceOrderPhotos : [];
  const geoSources = [address, ceo, order];

  return (
    <Screen scroll edges={['bottom']} statusBarStyle="light-content">
      <HeroHeader eyebrow="ORDEM DE SERVIÇO" title={`OS #${displayValue(displayId)}`} onBack={() => navigation.goBack()}>
        <StatusBadge status={status} large />
      </HeroHeader>

      <View style={styles.content}>
        <ErrorBanner message={error} style={styles.errorSpacing} />

        {nextStatus || !isTerminal ? (
          <SectionCard title="Ações da ordem">
            {nextStatus ? <Button label={actionLabel} onPress={openAttendance} style={styles.actionSpacing} /> : null}
            <Button label="Cancelar ordem" variant="outlineDanger" onPress={cancelOrder} />
          </SectionCard>
        ) : null}

        <SectionCard title="Informações da ordem">
          <InfoRow label="ID" value={displayId} />
          <InfoRow label="BoxNumber" value={ceo.boxNumber} />
          <InfoRow label="Descrição" value={ceo.notes} />
          <InfoRow label="Address" value={formatAddress(address)} />
          <InfoRow label="Usuário responsável" value={order?.user?.name} />
          <InfoRow label="Status" value={status} />
          <GeoRow label="Geolocation" coordinates={resolveGeolocation(geoSources)} bordered={false} />
        </SectionCard>

        <SectionCard title="Histórico de atendimentos">
          {history.length ? (
            history.map((entry, index) => (
              <View key={entry.id ?? index} style={[styles.historyItem, index === history.length - 1 && styles.historyItemLast]}>
                <Text style={styles.historyDate}>{formatDateTime(entry.createdAt)}</Text>
                <Text style={styles.historyText}>{entry.statusDescription}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.muted}>Nenhum registro de atendimento ainda.</Text>
          )}
        </SectionCard>

        <SectionCard title="Fotos anexadas" right={<Text style={styles.count}>{displayedPhotos.length}</Text>}>
          <CameraCapture serviceOrderId={id} onUploaded={load} />

          <View style={styles.gallery}>
            {displayedPhotos.map((photo, index) =>
              photoUri(photo) ? <Image key={`${photoUri(photo)}-${index}`} source={{ uri: photoUri(photo) }} style={styles.photo} /> : null
            )}
            {!displayedPhotos.length ? <Text style={styles.muted}>Nenhuma foto anexada ainda.</Text> : null}
          </View>
        </SectionCard>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxl + 4 },
  errorSpacing: { marginBottom: spacing.md },
  actionSpacing: { marginBottom: spacing.sm + 2 },
  count: { color: colors.primary, fontWeight: fontWeight.extrabold },
  historyItem: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
    paddingVertical: spacing.sm + 2,
  },
  historyItemLast: { borderBottomWidth: 0, paddingBottom: 0 },
  historyDate: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.extrabold,
    textTransform: 'uppercase',
  },
  historyText: { color: colors.textBody, fontSize: fontSize.md, marginTop: spacing.xs },
  gallery: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md + 2 },
  photo: { width: 96, height: 96, borderRadius: radius.md, backgroundColor: colors.borderSoft },
  muted: { color: colors.textMuted, marginTop: spacing.sm },
  centerState: { flex: 1, justifyContent: 'center', padding: spacing.xxl },
  centerError: { textAlign: 'center' },
  retryButton: { marginTop: spacing.md },
});
