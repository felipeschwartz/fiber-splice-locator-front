import React, { useCallback, useEffect, useState } from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { getApiErrorMessage } from '../services/api';
import { getCeo } from '../services/ceoService';
import { displayValue, firstValue } from '../utils/format';
import { Button, ErrorBanner, InfoRow, LoadingView, PageHeader, Screen, SectionCard } from '../components/ui';
import { colors, fontSize, fontWeight, radius, spacing } from '../theme';

const geoOf = (source) => firstValue(source, 'geoLocation', 'geolocation', 'coordinates');

export default function CeoDetailsScreen({ route, navigation }) {
  const { ceo: initialCeo, ceoId } = route?.params || {};
  const id = ceoId ?? initialCeo?.id;

  const [ceo, setCeo] = useState(initialCeo || null);
  const [loading, setLoading] = useState(!initialCeo);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (id == null) return;
    setLoading(true);
    setError('');

    try {
      setCeo(await getCeo(id));
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível carregar os dados da CEO.'));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const address = ceo?.address || {};
  const coordinates = geoOf(address) || geoOf(ceo);

  async function openMap() {
    if (!coordinates) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coordinates)}`;
    if (await Linking.canOpenURL(url)) await Linking.openURL(url);
  }

  if (loading) {
    return (
      <Screen>
        <LoadingView label="Carregando CEO..." />
      </Screen>
    );
  }

  if (error && !ceo) {
    return (
      <Screen>
        <View style={styles.centerState}>
          <ErrorBanner message={error} style={styles.centerError} />
          <Button label="Tentar novamente" onPress={load} style={styles.retryButton} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll padded>
      <PageHeader
        eyebrow="CAIXA DE EMENDAS ÓPTICAS"
        title={`CEO ${displayValue(ceo?.boxNumber)}`}
        onBack={() => navigation.goBack()}
        right={<Button label="Abrir OS" variant="outlinePrimary" onPress={() => navigation.navigate('ServiceOrderCreate', { ceo })} />}
      />

      <SectionCard title="Informações da CEO">
        <InfoRow label="ID" value={ceo?.id} />
        <InfoRow label="BoxNumber" value={ceo?.boxNumber} />
        <InfoRow label="Descrição" value={ceo?.notes} />
        <InfoRow label="Status" value={ceo?.status} bordered={false} />
      </SectionCard>

      <SectionCard title="Endereço completo">
        <InfoRow label="Tipo" value={address.addressType} />
        <InfoRow label="Rua" value={address.street} />
        <InfoRow label="Número" value={address.streetNumber} />
        <InfoRow label="Bairro" value={address.neighborhood} />
        <InfoRow label="Cidade" value={address.city} />
        <InfoRow label="Ponto de referência" value={address.referencePoint} bordered={false} />

        <View style={styles.geoRow}>
          <View style={styles.geoText}>
            <Text style={styles.geoLabel}>GEOLOCALIZAÇÃO</Text>
            <Text style={styles.geoValue}>{displayValue(coordinates)}</Text>
          </View>
          {coordinates ? (
            <Pressable style={styles.mapButton} onPress={openMap}>
              <Text style={styles.mapButtonText}>📍 Mapa</Text>
            </Pressable>
          ) : null}
        </View>
      </SectionCard>

      <ErrorBanner message={error} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  centerState: { flex: 1, justifyContent: 'center', padding: spacing.xxl },
  centerError: { textAlign: 'center' },
  retryButton: { marginTop: spacing.md },
  geoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: spacing.md },
  geoText: { flex: 1 },
  geoLabel: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.extrabold,
    textTransform: 'uppercase',
  },
  geoValue: { color: colors.textBody, fontSize: fontSize.md, marginTop: spacing.xs },
  mapButton: {
    marginLeft: spacing.md,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 2,
  },
  mapButtonText: { color: colors.primaryDark, fontWeight: fontWeight.extrabold },
});
