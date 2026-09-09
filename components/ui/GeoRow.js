import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, fontWeight, radius, spacing } from '../../theme';
import { displayValue } from '../../utils/format';

// Linha de geolocalização: rótulo + coordenadas, com um botão que abre o
// aplicativo de mapas do aparelho já centrado nesse ponto — usada nas
// telas de detalhe de CEO e de Ordem de Serviço.
export default function GeoRow({ label = 'Geolocalização', coordinates, bordered = true }) {
  async function openMap() {
    if (!coordinates) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coordinates)}`;
    // Não usar Linking.canOpenURL aqui: no Android 11+, as restrições de
    // "package visibility" fazem esse check retornar false pra https mesmo
    // quando existe navegador/Maps instalado, sem um <queries> no manifest.
    // Abrir direto funciona normalmente.
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.log('Failed to open map URL:', error.message);
    }
  }

  return (
    <View style={[styles.row, bordered && styles.bordered]}>
      <View style={styles.text}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{displayValue(coordinates)}</Text>
      </View>

      {coordinates ? (
        <Pressable style={styles.mapButton} onPress={openMap}>
          <Text style={styles.mapButtonText}>📍 Mapa</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.md },
  bordered: { borderBottomWidth: 1, borderBottomColor: colors.borderSoft },
  text: { flex: 1 },
  label: {
    color: colors.textMuted,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.extrabold,
    textTransform: 'uppercase',
  },
  value: { color: colors.textBody, fontSize: fontSize.md, marginTop: spacing.xs },
  mapButton: {
    marginLeft: spacing.md,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md - 2,
  },
  mapButtonText: { color: colors.primaryDark, fontWeight: fontWeight.extrabold },
});
