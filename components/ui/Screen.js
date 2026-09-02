import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../theme';

// Wrapper padrão de tela: cuida de safe area, status bar, fundo e
// (opcionalmente) rolagem e comportamento de teclado, para que cada
// tela não precise reimplementar isso na mão.
//
// `statusBarStyle` deve ser 'light-content' em telas que abrem com um
// HeroHeader navy no topo, e 'dark-content' nas demais (fundo claro).
export default function Screen({
  children,
  scroll = false,
  padded = false,
  keyboardAvoiding = false,
  edges = ['top', 'bottom'],
  background = colors.background,
  statusBarStyle = 'dark-content',
  contentContainerStyle,
  style,
}) {
  const content = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[padded && styles.padded, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, padded && styles.padded, contentContainerStyle]}>{children}</View>
  );

  const body = keyboardAvoiding ? (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {content}
    </KeyboardAvoidingView>
  ) : (
    content
  );

  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: background }, style]} edges={edges}>
      <StatusBar barStyle={statusBarStyle} />
      {body}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  padded: { padding: spacing.xl },
});
