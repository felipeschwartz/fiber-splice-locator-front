import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
  // `contentUrl` é o campo canônico devolvido pelo backend (GET .../content);
  // os demais ficam como fallback para formatos antigos/embutidos que não
  // passaram por esse mapeamento (ex.: `order.serviceOrderPhotos`).
  return typeof photo === 'string' ? photo : firstValue(photo, 'contentUrl', 'url', 'uri', 'fileUrl', 'path', 'imageUrl');
}

export default function ServiceOrderDetailScreen({ route, navigation }) {
  const { order: initialOrder, serviceOrderId } = route?.params || {};
  const id = serviceOrderId ?? initialOrder?.serviceOrderId ?? initialOrder?.id ?? initialOrder?.orderId;
  const { logout, token } = useAuth();

  const [order, setOrder] = useState(initialOrder || null);
  const [photos, setPhotos] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewerIndex, setViewerIndex] = useState(null);

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
  const galleryPhotos = displayedPhotos
    .map((photo) => ({ photo, uri: photoUri(photo) }))
    .filter((item) => item.uri);
  const geoSources = [address, ceo, order];
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : undefined;

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

        <SectionCard title="Fotos anexadas" right={<Text style={styles.count}>{galleryPhotos.length}</Text>}>
          <CameraCapture serviceOrderId={id} onUploaded={load} />

          <View style={styles.gallery}>
            {galleryPhotos.map((item, index) => (
              <Pressable key={`${item.uri}-${index}`} onPress={() => setViewerIndex(index)}>
                <Image source={{ uri: item.uri, headers: authHeaders }} style={styles.photo} />
              </Pressable>
            ))}
            {!galleryPhotos.length ? <Text style={styles.muted}>Nenhuma foto anexada ainda.</Text> : null}
          </View>
        </SectionCard>
      </View>

      <Modal
        visible={viewerIndex !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setViewerIndex(null)}
      >
        <View style={styles.viewerBackdrop}>
          <Pressable style={styles.viewerClose} onPress={() => setViewerIndex(null)} hitSlop={12}>
            <Ionicons name="close" size={28} color={colors.white} />
          </Pressable>

          {viewerIndex !== null ? (
            <Image
              source={{ uri: galleryPhotos[viewerIndex]?.uri, headers: authHeaders }}
              style={styles.viewerImage}
              resizeMode="contain"
            />
          ) : null}

          {galleryPhotos.length > 1 ? (
            <View style={styles.viewerNav}>
              <Pressable
                style={[styles.viewerNavButton, viewerIndex === 0 && styles.viewerNavButtonDisabled]}
                disabled={viewerIndex === 0}
                onPress={() => setViewerIndex((current) => Math.max(0, current - 1))}
                hitSlop={12}
              >
                <Ionicons name="chevron-back" size={28} color={colors.white} />
              </Pressable>

              <Text style={styles.viewerCount}>{viewerIndex + 1} / {galleryPhotos.length}</Text>

              <Pressable
                style={[styles.viewerNavButton, viewerIndex === galleryPhotos.length - 1 && styles.viewerNavButtonDisabled]}
                disabled={viewerIndex === galleryPhotos.length - 1}
                onPress={() => setViewerIndex((current) => Math.min(galleryPhotos.length - 1, current + 1))}
                hitSlop={12}
              >
                <Ionicons name="chevron-forward" size={28} color={colors.white} />
              </Pressable>
            </View>
          ) : null}
        </View>
      </Modal>
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
  viewerBackdrop: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.92)', justifyContent: 'center', alignItems: 'center' },
  viewerClose: { position: 'absolute', top: spacing.xxl, right: spacing.lg, zIndex: 1, padding: spacing.sm },
  viewerImage: { width: '100%', height: '80%' },
  viewerNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    marginTop: spacing.lg,
  },
  viewerNavButton: { padding: spacing.sm },
  viewerNavButtonDisabled: { opacity: 0.3 },
  viewerCount: { color: colors.white, fontWeight: fontWeight.extrabold },
});
