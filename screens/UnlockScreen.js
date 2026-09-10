import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { Button, ErrorBanner, Screen } from '../components/ui';
import { colors, fontSize, fontWeight, radius, spacing } from '../theme';

// Aparece quando já existe uma sessão salva e o aparelho tem biometria
// cadastrada — evita reabrir o app já autenticado sem nenhuma verificação.
export default function UnlockScreen() {
  const { unlock, logout } = useAuth();
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  const tryUnlock = useCallback(async () => {
    setChecking(true);
    setError('');
    try {
      const success = await unlock();
      if (!success) setError('Não foi possível confirmar sua identidade.');
    } catch (err) {
      setError(err.message || 'Não foi possível confirmar sua identidade.');
    } finally {
      setChecking(false);
    }
  }, [unlock]);

  useEffect(() => {
    tryUnlock();
  }, [tryUnlock]);

  return (
    <Screen keyboardAvoiding background={colors.backgroundSoft}>
      <View style={styles.container}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>FSL</Text>
        </View>

        <Text style={styles.title}>Sessão bloqueada</Text>
        <Text style={styles.subtitle}>Confirme sua biometria para continuar.</Text>

        <ErrorBanner message={error} style={styles.error} />

        <Button label="Desbloquear" onPress={tryUnlock} loading={checking} style={styles.unlockButton} />

        <Button label="Sair da conta" variant="outline" onPress={logout} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: spacing.xxl + 4 },
  logo: {
    alignSelf: 'center',
    width: 72,
    height: 72,
    borderRadius: radius.xxl,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  logoText: { color: colors.white, fontSize: fontSize.xxl, fontWeight: fontWeight.extrabold },
  title: { textAlign: 'center', color: colors.textTitle, fontSize: fontSize.title, fontWeight: fontWeight.extrabold },
  subtitle: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: fontSize.md,
    marginTop: spacing.sm,
    marginBottom: spacing.xxl,
  },
  error: { marginBottom: spacing.md },
  unlockButton: { marginBottom: spacing.md },
});
