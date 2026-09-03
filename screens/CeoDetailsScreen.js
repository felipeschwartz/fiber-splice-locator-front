import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getApiErrorMessage } from '../services/api';
import { getCeo } from '../services/ceoService';
import { displayValue, firstValue } from '../utils/format';
import { Button, ErrorBanner, GeoRow, InfoRow, LoadingView, PageHeader, Screen, SectionCard } from '../components/ui';
import { spacing } from '../theme';

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

  // Recarrega ao voltar da tela de edição, garantindo que os dados
  // exibidos reflitam a última alteração salva.
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const address = ceo?.address || {};
  const coordinates = geoOf(address) || geoOf(ceo);

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
        title={displayValue(ceo?.boxNumber)}
        onBack={() => navigation.goBack()}
        right={
          <View style={styles.headerActions}>
            <Button label="Editar" variant="outlinePrimary" onPress={() => navigation.navigate('CeoForm', { ceo })} style={styles.headerButton} />
            <Button label="Abrir OS" onPress={() => navigation.navigate('ServiceOrderCreate', { ceo })} />
          </View>
        }
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
        <InfoRow label="Ponto de referência" value={address.referencePoint} />
        <GeoRow coordinates={coordinates} bordered={false} />
      </SectionCard>

      <ErrorBanner message={error} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerActions: { alignItems: 'stretch' },
  headerButton: { marginBottom: spacing.sm },
  centerState: { flex: 1, justifyContent: 'center', padding: spacing.xxl },
  centerError: { textAlign: 'center' },
  retryButton: { marginTop: spacing.md },
});
