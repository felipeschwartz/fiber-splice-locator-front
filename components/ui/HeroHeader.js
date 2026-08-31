import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontSize, fontWeight, letterSpacing, spacing } from '../../theme';
import HomeButton from './HomeButton';
import HamburgerMenu from './HamburgerMenu';

// Bloco navy usado no topo das telas principais (Boas-vindas, Ordens,
// Detalhe da OS, Atendimento, CEOs). A cor pinta até atrás da status bar
// e o conteúdo respeita o inset — por isso o padding-top vem do
// useSafeAreaInsets em vez de um número fixo "chutado" por tela.
export default function HeroHeader({ eyebrow, title, subtitle, onBack, right, children, style }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top + spacing.lg }, style]}>
      <View style={styles.topRow}>
        <View style={styles.topRowLeft}>
          <HamburgerMenu />
          {onBack ? (
            <Pressable onPress={onBack} hitSlop={8}>
              <Text style={styles.back}>‹ Voltar</Text>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.topRowRight}>
          {right}
          <HomeButton />
        </View>
      </View>

      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: colors.navy,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 20,
  },
  topRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  topRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  back: {
    color: colors.onDarkLink,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  eyebrow: {
    color: colors.onDarkEyebrow,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.extrabold,
    letterSpacing: letterSpacing.eyebrow,
    marginTop: spacing.md,
  },
  title: {
    color: colors.onDarkTitle,
    fontSize: fontSize.display,
    fontWeight: fontWeight.extrabold,
    marginTop: spacing.sm,
  },
  subtitle: {
    color: colors.onDarkBody,
    fontSize: fontSize.md,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
});
