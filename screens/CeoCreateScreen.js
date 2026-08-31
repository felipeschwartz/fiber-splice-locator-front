import React, { useState } from 'react';
import { Alert, Linking, Pressable, StyleSheet, Text } from 'react-native';
import { getCurrentGeoLocation } from '../services/locationService';
import { getApiErrorMessage } from '../services/api';
import { createCeo } from '../services/ceoService';
import { CEO_STATUSES, labelCeoStatus } from '../utils/serviceOrder';
import { Button, PageHeader, Screen, SelectField, TextField } from '../components/ui';
import { colors, fontSize, fontWeight, radius, spacing } from '../theme';

const CEO_STATUS_OPTIONS = CEO_STATUSES.map((status) => ({ value: status, label: labelCeoStatus(status) }));

const ADDRESS_FIELDS = [
  ['addressType', 'Tipo de endereço'],
  ['street', 'Rua'],
  ['streetNumber', 'Número'],
  ['neighborhood', 'Bairro'],
  ['city', 'Cidade'],
  ['referencePoint', 'Ponto de referência'],
];

const EMPTY_ADDRESS = {
  addressType: '',
  street: '',
  streetNumber: '',
  neighborhood: '',
  city: '',
  referencePoint: '',
  geoLocation: '',
};

export default function CeoCreateScreen({ navigation }) {
  const [boxNumber, setBoxNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('STANDARDIZED');
  const [address, setAddress] = useState(EMPTY_ADDRESS);
  const [locationState, setLocationState] = useState('idle');
  const [locationError, setLocationError] = useState('');
  const [saving, setSaving] = useState(false);

  function setAddressField(key, value) {
    setAddress((current) => ({ ...current, [key]: value }));
  }

  async function useCurrentLocation() {
    setLocationState('loading');
    setLocationError('');

    try {
      setAddressField('geoLocation', await getCurrentGeoLocation());
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
    if (!boxNumber.trim()) {
      Alert.alert('Campo obrigatório', 'Informe o boxNumber da CEO.');
      return;
    }

    setSaving(true);

    try {
      const created = await createCeo({ boxNumber: boxNumber.trim(), notes: notes.trim(), status, address });
      navigation.replace('CeoDetails', { ceo: created });
    } catch (error) {
      Alert.alert('Não foi possível cadastrar a CEO', getApiErrorMessage(error, 'Verifique os dados e tente novamente.'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen scroll padded>
      <PageHeader eyebrow="NOVA CEO" title="Cadastrar CEO" onBack={() => navigation.goBack()} />

      <TextField label="BoxNumber" value={boxNumber} onChangeText={setBoxNumber} placeholder="Ex.: CEO-006" />
      <TextField label="Descrição" value={notes} onChangeText={setNotes} multiline placeholder="Observações sobre a caixa" />

      <SelectField label="Status" value={status} options={CEO_STATUS_OPTIONS} onChange={setStatus} />

      <Text style={styles.section}>Endereço</Text>

      {ADDRESS_FIELDS.map(([key, label]) => (
        <TextField key={key} label={label} value={address[key]} onChangeText={(value) => setAddressField(key, value)} />
      ))}

      <TextField
        label="Geolocalização"
        value={address.geoLocation}
        onChangeText={(value) => setAddressField('geoLocation', value)}
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

      <Button label="Cadastrar CEO" onPress={save} loading={saving} style={styles.saveButton} />
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
