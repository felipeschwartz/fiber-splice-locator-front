import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, fontWeight, letterSpacing, spacing } from '../../theme';
import HomeButton from './HomeButton';
import HamburgerMenu from './HamburgerMenu';

// Cabeçalho leve (fundo claro) usado em telas de formulário/detalhe que
// não precisam do bloco navy — mas ainda seguem o mesmo padrão de
// eyebrow + título + voltar das telas com HeroHeader.
export default function PageHeader({ eyebrow, title, onBack, right }) {
  return (
    <View style={styles.root}>
      <View style={styles.topRow}>
        <View style={styles.topRowLeft}>
          <HamburgerMenu tone="light" />
          {onBack ? (
            <Pressable onPress={onBack} hitSlop={8}>
              <Text style={styles.back}>‹ Voltar</Text>
            </Pressable>
          ) : null}
        </View>

        <HomeButton tone="light" />
      </View>

      <View style={styles.headingRow}>
        <View style={styles.headingText}>
          {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
          {title ? <Text style={styles.title}>{title}</Text> : null}
        </View>
        {right}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { marginBottom: spacing.sm },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 20,
    marginBottom: spacing.md,
  },
  topRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  back: {
    color: colors.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  headingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headingText: { flex: 1 },
  eyebrow: {
    color: colors.primary,
    fontSize: fontSize.base,
    fontWeight: fontWeight.extrabold,
    letterSpacing: letterSpacing.eyebrow,
  },
  title: {
    color: colors.textTitle,
    fontSize: fontSize.display,
    fontWeight: fontWeight.extrabold,
    marginTop: spacing.sm,
  },
});
