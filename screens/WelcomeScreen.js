import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { IconTile, LinkText, Modal, Screen } from '../components/ui';
import { HOME_SHORTCUTS } from '../utils/navigation';
import { colors, fontSize, fontWeight, letterSpacing, spacing } from '../theme';

const COLLABORATORS = [
  'Eduardo Ribeiro Silveira',
  'Vorni Valpir Fagundes da Cunha Junior',
  'Diego Ribeiro Torres',
  'Lucas Candido Vargas',
];

export default function WelcomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  const firstName = user?.name?.split(' ')[0];
  const [aboutVisible, setAboutVisible] = useState(false);

  return (
    <Screen background={colors.navy} statusBarStyle="light-content" padded>
      <View style={styles.content}>
        <View>
          <View style={styles.topRow}>
            <Text style={styles.eyebrow}>FIBER SPLICE LOCATOR</Text>
            <Pressable onPress={() => setAboutVisible(true)} hitSlop={8}>
              <Ionicons name="information-circle-outline" size={24} color={colors.onDarkEyebrow} />
            </Pressable>
          </View>

          <Text style={styles.title}>Olá{firstName ? `, ${firstName}` : ''}! O que você deseja fazer?</Text>
          <Text style={styles.subtitle}>
            Acesse CEOs, crie ordens e acompanhe os atendimentos em campo.
          </Text>

          <View style={styles.shortcuts}>
            {HOME_SHORTCUTS.map((shortcut) => (
              <IconTile
                key={shortcut.destination}
                icon={shortcut.icon}
                label={shortcut.label}
                onPress={() => navigation.navigate(shortcut.destination)}
              />
            ))}
          </View>
        </View>

        <Pressable onPress={logout} style={styles.logout}>
          <Text style={styles.logoutText}>Sair da conta</Text>
        </Pressable>
      </View>

      <Modal visible={aboutVisible} onClose={() => setAboutVisible(false)}>
        <Text style={styles.aboutTitle}>Sobre o Fiber Splice Locator</Text>

        <Text style={styles.aboutText}>
          Este aplicativo foi desenvolvido como trabalho da disciplina Programação para Dispositivos
          Móveis, do curso de Análise e Desenvolvimento de Sistemas da Universidade Unisinos.
        </Text>

        <Text style={styles.aboutText}>
          O projeto atende a uma necessidade real da{' '}
          <LinkText url="https://pop-rs.rnp.br/">POP-RS/RNP</LinkText>, que hoje controla suas Caixas
          de Emenda Óptica (CEOs) por planilhas de Excel e fotos trocadas por WhatsApp.
        </Text>

        <Text style={styles.aboutSection}>Desenvolvedor principal</Text>
        <Text style={styles.aboutText}>
          <LinkText url="https://github.com/felipeschwartz">Felipe Schwartz</LinkText>
        </Text>

        <Text style={styles.aboutSection}>Colaboradores</Text>
        {COLLABORATORS.map((name) => (
          <Text key={name} style={styles.aboutText}>{name}</Text>
        ))}

        <Text style={styles.aboutSection}>Repositórios</Text>
        <Text style={styles.aboutText}>
          Mobile:{' '}
          <LinkText url="https://github.com/felipeschwartz/fiber-splice-locator-front">
            fiber-splice-locator-front
          </LinkText>
        </Text>
        <Text style={styles.aboutText}>
          BackEnd:{' '}
          <LinkText url="https://github.com/felipeschwartz/fiber-splice-locator">
            fiber-splice-locator
          </LinkText>
        </Text>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, justifyContent: 'space-between' },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
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
  shortcuts: { flexDirection: 'row', gap: spacing.sm + 2, marginTop: spacing.xxl + 8 },
  logout: { alignItems: 'center', padding: spacing.lg + 2 },
  logoutText: { color: colors.onDarkMuted, fontWeight: fontWeight.bold },
  aboutTitle: {
    color: colors.textTitle,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.extrabold,
    marginBottom: spacing.md,
    marginRight: spacing.xl,
  },
  aboutSection: {
    color: colors.textTitle,
    fontSize: fontSize.base,
    fontWeight: fontWeight.extrabold,
    textTransform: 'uppercase',
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  aboutText: { color: colors.textBody, fontSize: fontSize.md, lineHeight: 21 },
});
