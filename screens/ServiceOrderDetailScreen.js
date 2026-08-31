import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { getApiErrorMessage } from '../services/api';
import { getServiceOrder } from '../services/serviceOrderService';
import { listServiceOrderPhotos } from '../services/serviceOrderPhotoService';
import { displayValue, firstValue, formatAddress, formatGeolocation } from '../utils/format';
import { NEXT_STATUS_BY_CURRENT } from '../utils/serviceOrder';
import StatusBadge from '../components/StatusBadge';
import CameraCapture from '../components/CameraCapture';
import { Button, ErrorBanner, HeroHeader, InfoRow, LoadingView, Screen, SectionCard } from '../components/ui';
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
      const [orderData, photoData] = await Promise.all([getServiceOrder(id), listServiceOrderPhotos(id)]);
      setOrder(orderData);
      setPhotos(photoData);
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
          <InfoRow label="Status" value={status} />
          <InfoRow label="Geolocation" value={formatGeolocation(geoSources)} bordered={false} />
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
  gallery: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md + 2 },
  photo: { width: 96, height: 96, borderRadius: radius.md, backgroundColor: colors.borderSoft },
  muted: { color: colors.textMuted, marginTop: spacing.sm },
  centerState: { flex: 1, justifyContent: 'center', padding: spacing.xxl },
  centerError: { textAlign: 'center' },
  retryButton: { marginTop: spacing.md },
});
