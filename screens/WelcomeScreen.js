import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { IconTile, Screen } from '../components/ui';
import { colors, fontSize, fontWeight, letterSpacing, spacing } from '../theme';

const SHORTCUTS = [
  { icon: 'construct-outline', label: 'Ordens de serviço', destination: 'ServiceOrders' },
  { icon: 'git-network-outline', label: 'CEOs', destination: 'CeoList' },
  { icon: 'people-outline', label: 'Usuários', destination: 'Users' },
];

export default function WelcomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  const firstName = user?.name?.split(' ')[0];

  return (
    <Screen background={colors.navy} statusBarStyle="light-content" padded>
      <View style={styles.content}>
        <View>
          <Text style={styles.eyebrow}>FIBER SPLICE LOCATOR</Text>
          <Text style={styles.title}>Olá{firstName ? `, ${firstName}` : ''}! O que você deseja fazer?</Text>
          <Text style={styles.subtitle}>
            Acesse CEOs, crie ordens e acompanhe os atendimentos em campo.
          </Text>
        </View>

        <View style={styles.actions}>
          <View style={styles.shortcuts}>
            {SHORTCUTS.map((shortcut) => (
              <IconTile
                key={shortcut.destination}
                icon={shortcut.icon}
                label={shortcut.label}
                onPress={() => navigation.navigate(shortcut.destination)}
              />
            ))}
          </View>

          <Pressable onPress={logout} style={styles.logout}>
            <Text style={styles.logoutText}>Sair da conta</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, justifyContent: 'space-between' },
  eyebrow: {
    color: colors.onDarkEyebrow,
    fontWeight: fontWeight.extrabold,
    letterSpacing: letterSpacing.eyebrow,
  },
  title: {
    color: colors.onDarkTitle,
    fontSize: fontSize.hero,
    fontWeight: fontWeight.extrabold,
    lineHeight: 41,
    marginTop: spacing.md + 2,
  },
  subtitle: {
    color: colors.onDarkBody,
    fontSize: fontSize.lg,
    lineHeight: 24,
    marginTop: spacing.md + 2,
  },
  actions: { marginBottom: spacing.lg + 2 },
  shortcuts: { flexDirection: 'row', gap: spacing.sm + 2 },
  logout: { alignItems: 'center', padding: spacing.lg + 2 },
  logoutText: { color: colors.onDarkMuted, fontWeight: fontWeight.bold },
});
