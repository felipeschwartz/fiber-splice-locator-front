import React from 'react';
import { Linking, StyleSheet, Text } from 'react-native';
import { colors, fontWeight } from '../../theme';

// Texto que abre uma URL externa ao tocar — usado em links de referência
// (repositórios, sites) dentro de conteúdo informativo.
export default function LinkText({ url, children, style }) {
  return (
    <Text style={[styles.link, style]} onPress={() => Linking.openURL(url)}>
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  link: { color: colors.primary, fontWeight: fontWeight.bold },
});
