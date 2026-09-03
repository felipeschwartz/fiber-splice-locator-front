import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { getApiErrorMessage } from '../services/api';
import { forgotPassword } from '../services/authService';
import { Button, Card, ErrorBanner, Screen, TextField } from '../components/ui';
import { colors, fontSize, fontWeight, spacing } from '../theme';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit() {
    if (!email.trim()) {
      setError('Informe seu e-mail.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      await forgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível enviar o código. Tente novamente.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Screen keyboardAvoiding background={colors.backgroundSoft}>
      <View style={styles.container}>
        <Text style={styles.title}>Esqueci minha senha</Text>
        <Text style={styles.subtitle}>
          Informe o e-mail da sua conta. Se ele existir, você vai receber um código de redefinição.
        </Text>

        <Card style={styles.form}>
          {sent ? (
            <>
              <Text style={styles.successText}>
                Se {email.trim()} estiver cadastrado, um código foi enviado. Confira seu e-mail.
              </Text>
              <Button
                label="Já tenho o código"
                onPress={() => navigation.replace('ResetPassword', { email: email.trim() })}
                style={styles.submit}
              />
            </>
          ) : (
            <>
              <TextField
                label="E-mail"
                value={email}
                onChangeText={setEmail}
                placeholder="seu@email.com"
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
                editable={!submitting}
                onSubmitEditing={handleSubmit}
              />

              <ErrorBanner message={error} style={styles.error} />

              <Button label="Enviar código" onPress={handleSubmit} loading={submitting} style={styles.submit} />
            </>
          )}

          <Button label="Voltar ao login" variant="outline" onPress={() => navigation.goBack()} style={styles.backButton} />
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: spacing.xxl + 4 },
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
  successText: { color: colors.textBody, fontSize: fontSize.md, lineHeight: 21, marginBottom: spacing.md },
  submit: { marginTop: spacing.sm },
  backButton: { marginTop: spacing.md },
});
