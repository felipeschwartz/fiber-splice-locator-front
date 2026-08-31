import React, { useMemo, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { getApiErrorMessage } from '../services/api';
import { createServiceOrder } from '../services/serviceOrderService';
import { CEO_STATUSES, labelCeoStatus } from '../utils/serviceOrder';
import { displayValue } from '../utils/format';
import { Button, PageHeader, Screen, SelectField, TextField } from '../components/ui';
import { colors, fontSize, fontWeight, radius, spacing } from '../theme';

const CEO_STATUS_OPTIONS = CEO_STATUSES.map((status) => ({ value: status, label: labelCeoStatus(status) }));

export default function ServiceOrderCreateScreen({ route, navigation }) {
  const ceo = route?.params?.ceo || {};
  const { user } = useAuth();
  const ceoId = ceo.id;

  const [ceoStatus, setCeoStatus] = useState(ceo.status || 'STANDARDIZED');
  const [userId, setUserId] = useState(String(user?.id ?? ''));
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const canSubmit = useMemo(
    () => ceoId != null && userId.trim() !== '' && description.trim() !== '',
    [ceoId, userId, description]
  );

  async function submit() {
    if (!canSubmit) {
      Alert.alert('Campos obrigatórios', 'Informe o usuário e descreva o problema.');
      return;
    }

    if (!/^\d+$/.test(userId.trim())) {
      Alert.alert('Usuário inválido', 'Informe um ID de usuário numérico.');
      return;
    }

    setSaving(true);

    try {
      const order = await createServiceOrder({ ceoId, ceoStatus, userId: userId.trim(), statusDescription: description });
      const createdId = order?.serviceOrderId ?? order?.id;
      if (createdId == null) throw new Error('A API não retornou o ID da ordem criada.');
      navigation.replace('ServiceOrderDetail', { order, serviceOrderId: createdId });
    } catch (error) {
      Alert.alert('Não foi possível abrir a OS', getApiErrorMessage(error, 'Verifique os dados e tente novamente.'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen scroll padded>
      <PageHeader eyebrow="NOVA ORDEM DE SERVIÇO" title="Abrir OS" onBack={() => navigation.goBack()} />

      <Text style={styles.label}>CEO</Text>
      <View style={styles.readonly}>
        <Text style={styles.readonlyText}>{displayValue(ceo.boxNumber)} · ID {displayValue(ceoId)}</Text>
      </View>

      <SelectField label="CEO Status" value={ceoStatus} options={CEO_STATUS_OPTIONS} onChange={setCeoStatus} />

      <TextField
        label="Usuário responsável"
        value={userId}
        onChangeText={setUserId}
        keyboardType="numeric"
        placeholder="ID do usuário"
      />

      <TextField
        label="Descrição do problema"
        value={description}
        onChangeText={setDescription}
        multiline
        maxLength={500}
        placeholder="Descreva brevemente o problema ou a solução realizada"
      />

      <View style={styles.actions}>
        <Button label="Cancelar" variant="outline" onPress={() => navigation.goBack()} disabled={saving} style={styles.flexButton} />
        <Button label="Confirmar" onPress={submit} loading={saving} disabled={!canSubmit} style={styles.flexButton} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: {
    color: colors.textSecondary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.extrabold,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  readonly: {
    backgroundColor: colors.borderSoft,
    borderRadius: radius.md,
    minHeight: 46,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  readonlyText: { color: colors.textSecondary, fontSize: fontSize.md, fontWeight: fontWeight.bold },
  actions: { flexDirection: 'row', gap: spacing.sm + 2, marginTop: spacing.xxl + 2 },
  flexButton: { flex: 1 },
});
