import React, { useState } from 'react';
import { Alert, Linking, Pressable, StyleSheet, Text } from 'react-native';
import { getCurrentGeoLocation } from '../services/locationService';
import { getApiErrorMessage } from '../services/api';
import { updateCeo } from '../services/ceoService';
import { CEO_STATUSES, labelCeoStatus } from '../utils/serviceOrder';
import { Button, PageHeader, Screen, SelectField, TextField } from '../components/ui';
import { colors, fontSize, fontWeight, radius, spacing } from '../theme';

const CEO_STATUS_OPTIONS = CEO_STATUSES.map((status) => ({ value: status, label: labelCeoStatus(status) }));

const ADDRESS_FIELDS = [
  ['addressType', 'Tipo de endereço'],
  ['street', 'Rua / Avenida'],
  ['streetNumber', 'Número'],
  ['neighborhood', 'Bairro'],
  ['city', 'Cidade'],
  ['referencePoint', 'Ponto de referência'],
];

export default function CeoFormScreen({ route, navigation }) {
  const existing = route?.params?.ceo || {};
  const existingAddress = existing.address || {};

  const [form, setForm] = useState({
    boxNumber: String(existing.boxNumber ?? ''),
    notes: existing.notes || '',
    status: existing.status || 'STANDARDIZED',
    address: {
      ...existingAddress,
      geoLocation: existingAddress.geoLocation || existingAddress.geolocation || '',
    },
  });
  const [locationState, setLocationState] = useState('idle');
  const [locationError, setLocationError] = useState('');
  const [saving, setSaving] = useState(false);

  function setAddress(key, value) {
    setForm((current) => ({ ...current, address: { ...current.address, [key]: value } }));
  }

  async function useCurrentLocation() {
    setLocationState('loading');
    setLocationError('');

    try {
      setAddress('geoLocation', await getCurrentGeoLocation());
      setLocationState('success');
    } catch (error) {
      setLocationState('denied');
      setLocationError(
        error.code === 'LOCATION_BLOCKED'
          ? 'A localização foi bloqueada. Ative a permissão nas configurações ou preencha manualmente.'
          : 'Não foi possível obter a localização.'
      );
    }
  }

  async function save() {
    if (!existing.id) {
      Alert.alert('CEO não identificada', 'Não é possível editar esta CEO sem um ID.');
      return;
    }

    if (!form.boxNumber.trim()) {
      Alert.alert('Campo obrigatório', 'Informe o boxNumber.');
      return;
    }

    setSaving(true);

    try {
      await updateCeo(existing.id, form);
      Alert.alert('CEO salva', 'As alterações foram atualizadas.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (error) {
      Alert.alert('Não foi possível salvar', getApiErrorMessage(error, 'Tente novamente.'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen scroll padded>
      <PageHeader eyebrow="EDITAR CEO" title={form.boxNumber || existing.boxNumber || ''} onBack={() => navigation.goBack()} />

      <TextField
        label="BoxNumber"
        value={form.boxNumber}
        onChangeText={(value) => setForm((current) => ({ ...current, boxNumber: value }))}
        keyboardType="numeric"
      />

      <TextField
        label="Descrição"
        value={form.notes}
        onChangeText={(value) => setForm((current) => ({ ...current, notes: value }))}
        multiline
      />

      <SelectField
        label="Status"
        value={form.status}
        options={CEO_STATUS_OPTIONS}
        onChange={(value) => setForm((current) => ({ ...current, status: value }))}
      />

      <Text style={styles.section}>Endereço</Text>

      {ADDRESS_FIELDS.map(([key, label]) => (
        <TextField
          key={key}
          label={label}
          value={String(form.address[key] || '')}
          onChangeText={(value) => setAddress(key, value)}
        />
      ))}

      <TextField
        label="Geolocalização"
        value={form.address.geoLocation || ''}
        onChangeText={(value) => setAddress('geoLocation', value)}
        placeholder="latitude, longitude"
        autoCapitalize="none"
      />

      <Button
        label="Usar minha localização atual"
        variant="outlinePrimary"
        loading={locationState === 'loading'}
        onPress={useCurrentLocation}
        style={styles.locationButton}
      />

      {locationState === 'success' ? <Text style={styles.success}>Localização preenchida com sucesso.</Text> : null}

      {locationError ? (
        <Pressable style={styles.warning} onPress={() => Linking.openSettings()}>
          <Text style={styles.warningText}>{locationError}</Text>
          <Text style={styles.settingsLink}>Abrir configurações</Text>
        </Pressable>
      ) : null}

      <Button label="Salvar CEO" onPress={save} loading={saving} style={styles.saveButton} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: {
    color: colors.textTitle,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.extrabold,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  locationButton: { marginTop: spacing.md + 2 },
  success: { color: colors.successText, marginTop: spacing.sm },
  warning: { backgroundColor: colors.warningBg, padding: spacing.md, borderRadius: radius.md, marginTop: spacing.sm + 2 },
  warningText: { color: colors.warningText, lineHeight: 19 },
  settingsLink: { color: colors.primaryDark, fontWeight: fontWeight.extrabold, marginTop: spacing.sm },
  saveButton: { marginTop: spacing.xxl },
});
