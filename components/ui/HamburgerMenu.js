import React, { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, fontSize, fontWeight, spacing } from '../../theme';
import { HOME_SHORTCUTS } from '../../utils/navigation';
import Modal from './Modal';

// Menu sanduíche presente em todo cabeçalho (HeroHeader/PageHeader) —
// dá acesso direto às três seções principais sem precisar voltar pra
// tela inicial primeiro.
export default function HamburgerMenu({ tone = 'dark' }) {
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);
  const color = tone === 'dark' ? colors.onDarkTitle : colors.primary;

  function go(destination) {
    setOpen(false);
    navigation.navigate(destination);
  }

  return (
    <>
      <Pressable onPress={() => setOpen(true)} hitSlop={8} style={styles.button}>
        <Ionicons name="menu-outline" size={24} color={color} />
      </Pressable>

      <Modal visible={open} onClose={() => setOpen(false)}>
        <Text style={styles.title}>Ir para</Text>

        {HOME_SHORTCUTS.map((shortcut, index) => (
          <Pressable
            key={shortcut.destination}
            onPress={() => go(shortcut.destination)}
            style={[styles.item, index === HOME_SHORTCUTS.length - 1 && styles.itemLast]}
          >
            <Ionicons name={shortcut.icon} size={22} color={colors.primary} />
            <Text style={styles.itemText}>{shortcut.label}</Text>
          </Pressable>
        ))}
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: { padding: 4 },
  title: {
    color: colors.textTitle,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.extrabold,
    marginBottom: spacing.md,
    marginRight: spacing.xl,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSoft,
  },
  itemLast: { borderBottomWidth: 0 },
  itemText: { color: colors.textBody, fontSize: fontSize.lg, fontWeight: fontWeight.bold },
});
