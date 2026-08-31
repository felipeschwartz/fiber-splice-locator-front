import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, TextInput, View } from 'react-native';
import { getApiErrorMessage } from '../services/api';
import { listCeos } from '../services/ceoService';
import { Card, EmptyState, ErrorBanner, HeroHeader, LoadingView, Screen } from '../components/ui';
import { colors, fontSize, fontWeight, radius, spacing } from '../theme';

export default function CeoListScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [ceos, setCeos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const load = useCallback(async (refresh = false) => {
    refresh ? setRefreshing(true) : setLoading(true);
    setError('');

    try {
      const result = await listCeos(query);
      setCeos(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível carregar as CEOs.'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [query]);

  useEffect(() => {
    load();
    // Carrega a lista apenas quando a tela é aberta; buscas subsequentes
    // são disparadas manualmente pelo botão/teclado de busca (`search`),
    // que sempre chama a versão mais atual de `load` (com o `query` em dia).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function search() {
    load();
  }

  function renderCeo({ item }) {
    return (
      <Pressable onPress={() => navigation.navigate('CeoDetails', { ceo: item })}>
        <Card style={styles.card}>
          <View style={styles.cardRow}>
            <Text style={styles.cardTitle}>CEO {item.boxNumber ?? '—'}</Text>
            <Text style={styles.cardAction}>Ver detalhes</Text>
          </View>
          <Text style={styles.cardMeta}>ID: {item.id ?? '—'}</Text>
          <Text style={styles.cardNotes} numberOfLines={2}>{item.notes || 'Sem descrição cadastrada'}</Text>
        </Card>
      </Pressable>
    );
  }

  return (
    <Screen edges={['bottom']} statusBarStyle="light-content">
      <HeroHeader eyebrow="CAIXAS DE EMENDAS ÓPTICAS" title="CEOs">
        <View style={styles.search}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={search}
            placeholder="Buscar por ID ou boxNumber"
            placeholderTextColor={colors.placeholder}
            style={styles.searchInput}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
          <Pressable onPress={search} style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Buscar</Text>
          </Pressable>
        </View>
      </HeroHeader>

      {loading ? (
        <LoadingView label="Carregando CEOs..." />
      ) : (
        <FlatList
          data={ceos}
          keyExtractor={(item, index) => String(item.id ?? item.boxNumber ?? index)}
          renderItem={renderCeo}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} colors={[colors.primary]} tintColor={colors.primary} />}
          contentContainerStyle={ceos.length > 0 ? styles.list : styles.emptyList}
          ListHeaderComponent={error ? <ErrorBanner message={error} style={styles.errorBanner} /> : null}
          ListEmptyComponent={<EmptyState title="Nenhuma CEO encontrada" message="Tente outro ID ou boxNumber." />}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  search: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.lg },
  searchInput: {
    flex: 1,
    height: 46,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    color: colors.textTitle,
    marginRight: spacing.sm,
  },
  searchButton: {
    height: 46,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md + 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: { color: colors.white, fontWeight: fontWeight.extrabold },
  list: { padding: spacing.lg },
  emptyList: { flexGrow: 1, padding: spacing.lg },
  card: { marginBottom: spacing.md },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { flex: 1, fontSize: fontSize.xl, fontWeight: fontWeight.extrabold, color: colors.textTitle, marginRight: spacing.sm },
  cardAction: { color: colors.primary, fontWeight: fontWeight.extrabold },
  cardMeta: { color: colors.textMuted, marginTop: spacing.sm - 1 },
  cardNotes: { color: colors.textBody, marginTop: spacing.sm + 1 },
  errorBanner: { marginBottom: spacing.md },
});
