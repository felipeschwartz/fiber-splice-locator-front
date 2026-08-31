import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { getApiErrorMessage } from '../services/api';
import { Button, Card, ErrorBanner, Screen, TextField } from '../components/ui';
import { colors, fontSize, fontWeight, radius, spacing } from '../theme';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!email.trim() || !password) {
      setError('Informe e-mail e senha.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      await login(email.trim(), password);
    } catch (err) {
      const message = err.message?.includes('token')
        ? err.message
        : getApiErrorMessage(err, 'Não foi possível entrar. Tente novamente.');
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen keyboardAvoiding background={colors.backgroundSoft}>
      <View style={styles.container}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>FS</Text>
        </View>

        <Text style={styles.title}>Fiber Splice Locator</Text>
        <Text style={styles.subtitle}>Acesse suas ordens de serviço</Text>

        <Card style={styles.form}>
          <TextField
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
            editable={!submitting}
          />

          <TextField
            label="Senha"
            value={password}
            onChangeText={setPassword}
            placeholder="Sua senha"
            secureTextEntry
            editable={!submitting}
            onSubmitEditing={handleSubmit}
          />

          <ErrorBanner message={error} style={styles.error} />

          <Button label="Entrar" onPress={handleSubmit} loading={submitting} />
        </Card>
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
  logoText: { color: colors.white, fontSize: fontSize.xxl + 6, fontWeight: fontWeight.extrabold },
  title: { textAlign: 'center', color: colors.textTitle, fontSize: fontSize.title, fontWeight: fontWeight.extrabold },
  subtitle: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: fontSize.md,
    marginTop: spacing.sm,
    marginBottom: spacing.xxl + 12,
  },
  form: { padding: spacing.xl },
  error: { marginBottom: spacing.md },
});
