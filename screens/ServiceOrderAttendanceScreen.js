import React, { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { getApiErrorMessage } from '../services/api';
import { completeServiceOrderAttendance } from '../services/serviceOrderService';
import { uploadServiceOrderPhoto } from '../services/serviceOrderPhotoService';
import { getCurrentGeoLocation } from '../services/locationService';
import { SERVICE_ORDER_STATUSES } from '../utils/serviceOrder';
import CameraCapture from '../components/CameraCapture';
import { Button, Chip, ErrorBanner, HeroHeader, Screen, SectionCard, TextField } from '../components/ui';
import { colors, fontSize, spacing } from '../theme';

export default function ServiceOrderAttendanceScreen({ route, navigation }) {
  const { order, serviceOrderId } = route?.params || {};
  const id = serviceOrderId ?? order?.serviceOrderId ?? order?.id;
  const currentStatus = String(order?.status || 'OPEN').toUpperCase();
  const initialStatus = route?.params?.initialStatus;
  const { logout } = useAuth();

  const [description, setDescription] = useState('');
  const [status, setStatus] = useState(initialStatus || (currentStatus === 'OPEN' ? 'IN_PROGRESS' : currentStatus));
  const [changeLocation, setChangeLocation] = useState(false);
  const [geoLocation, setGeoLocation] = useState('');
  const [photos, setPhotos] = useState([]);
  const [capturingLocation, setCapturingLocation] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function captureLocation() {
    setCapturingLocation(true);
    setError('');

    try {
      setGeoLocation(await getCurrentGeoLocation());
    } catch (err) {
      setError(err.message || 'Não foi possível obter a localização atual.');
    } finally {
      setCapturingLocation(false);
    }
  }

  async function confirm() {
    if (!description.trim()) {
      setError('Informe os comentários pertinentes ao atendimento.');
      return;
    }

    if (changeLocation && !geoLocation.trim()) {
      setError('Informe ou capture a nova geolocalização.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await completeServiceOrderAttendance(id, {
        status,
        statusDescription: description.trim(),
        geoLocation: changeLocation ? geoLocation.trim() : null,
      });

      for (const photo of photos) {
        await uploadServiceOrderPhoto(id, photo);
      }

      Alert.alert('Atendimento salvo', 'Os dados da ordem foram atualizados.', [
        { text: 'OK', onPress: () => navigation.pop(2) },
      ]);
    } catch (err) {
      if (err.response?.status === 401) await logout();
      else setError(getApiErrorMessage(err, 'Não foi possível salvar o atendimento.'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen scroll edges={['bottom']} statusBarStyle="light-content">
      <HeroHeader
        eyebrow="ATENDIMENTO DA OS"
        title={`OS #${id}`}
        subtitle="Registre o que foi realizado em campo."
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <ErrorBanner message={error} style={styles.errorSpacing} />

        <SectionCard title="Comentários do atendimento *">
          <TextField
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={5}
            placeholder="Descreva as atividades, ocorrências e observações..."
          />
        </SectionCard>

        <SectionCard title="Mudança de Geolocalização?">
          <View style={styles.toggleRow}>
            <Chip label="Não" active={!changeLocation} onPress={() => setChangeLocation(false)} style={styles.flexChip} />
            <Chip label="Sim" active={changeLocation} onPress={() => setChangeLocation(true)} style={styles.flexChip} />
          </View>

          {changeLocation ? (
            <>
              <TextField
                value={geoLocation}
                onChangeText={setGeoLocation}
                placeholder="Ex.: -23.5505, -46.6333"
                autoCapitalize="none"
                style={styles.locationInput}
              />
              <Button
                label="⌖ Usar localização atual"
                variant="outlinePrimary"
                loading={capturingLocation}
                onPress={captureLocation}
              />
            </>
          ) : null}
        </SectionCard>

        <SectionCard title="Novo status da OS">
          <View style={styles.statusGrid}>
            {SERVICE_ORDER_STATUSES.map((option) => (
              <Chip key={option} label={option} active={status === option} onPress={() => setStatus(option)} />
            ))}
          </View>
        </SectionCard>

        <SectionCard title="Fotos do atendimento">
          <Text style={styles.helper}>As fotos serão associadas à OS após a confirmação.</Text>
          <CameraCapture serviceOrderId={id} deferUpload onPhotoSelected={(photo) => setPhotos((current) => [...current, photo])} />
          <Text style={styles.photoCount}>{photos.length} foto(s) selecionada(s)</Text>
        </SectionCard>

        <View style={styles.actions}>
          <Button label="Cancelar" variant="outline" onPress={() => navigation.goBack()} disabled={saving} style={styles.flexButton} />
          <Button label="Confirmar" onPress={confirm} loading={saving} style={styles.flexButton} />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  errorSpacing: { marginBottom: spacing.md },
  toggleRow: { flexDirection: 'row', gap: spacing.sm },
  flexChip: { flex: 1, alignItems: 'center' },
  locationInput: { marginTop: spacing.sm + 2, marginBottom: spacing.sm + 2 },
  statusGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  helper: { color: colors.textMuted, fontSize: fontSize.base, marginBottom: spacing.sm },
  photoCount: { color: colors.textMuted, marginTop: spacing.md, fontSize: fontSize.base },
  actions: { flexDirection: 'row', gap: spacing.sm + 2, marginTop: spacing.sm },
  flexButton: { flex: 1 },
});
