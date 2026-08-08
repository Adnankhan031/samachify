import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ProductCard } from '@/components/ProductCard';
import { EmptyState, Screen, Skeleton } from '@/components/ui';
import { listProducts, searchProducts, type Product } from '@/lib/catalogue';
import { plural } from '@/lib/format';
import { colors, radius, spacing, type, MIN_TOUCH } from '@/theme';

/** Real terms that match the real catalogue — no invented "trending" data. */
const SUGGESTIONS = ['Sambar', 'Kuzhambu', 'Chutney', 'Coconut', 'Vegan', 'Mild'];

export default function Search() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[] | null>(null);
  const [all, setAll] = useState<Product[]>([]);

  useEffect(() => {
    listProducts().then(setAll).catch(() => setAll([]));
  }, []);

  // Debounced so a fast typist doesn't trigger a search per keystroke. Cheap now,
  // and it stays correct when this becomes a network call.
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults(null);
      return;
    }

    let cancelled = false;
    const timer = setTimeout(() => {
      searchProducts(trimmed)
        .then((found) => !cancelled && setResults(found))
        .catch(() => !cancelled && setResults([]));
    }, 180);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const showing = useMemo(() => results ?? all, [results, all]);
  const searching = query.trim().length > 0;

  return (
    <Screen>
      <View style={styles.searchRow}>
        <Pressable
          onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          style={({ pressed }) => [styles.back, pressed && { opacity: 0.5 }]}
        >
          <Text style={styles.backGlyph}>‹</Text>
        </Pressable>

        <View style={styles.field}>
          <Text style={styles.glyph}>⌕</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search meal kits, chutneys…"
            placeholderTextColor={colors.mutedLight}
            autoFocus
            returnKeyType="search"
            onSubmitEditing={Keyboard.dismiss}
            accessibilityLabel="Search the Samachify catalogue"
            style={styles.input}
          />
          {query.length > 0 ? (
            <Pressable
              onPress={() => setQuery('')}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Clear search"
            >
              <Text style={styles.clear}>×</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      {!searching ? (
        <View style={styles.suggestBlock}>
          <Text style={styles.suggestLabel}>Try searching for</Text>
          <View style={styles.suggestions}>
            {SUGGESTIONS.map((term) => (
              <Pressable
                key={term}
                onPress={() => setQuery(term)}
                accessibilityRole="button"
                style={({ pressed }) => [styles.suggestion, pressed && { opacity: 0.6 }]}
              >
                <Text style={styles.suggestionText}>{term}</Text>
              </Pressable>
            ))}
          </View>
          <Text style={styles.allLabel}>All packs</Text>
        </View>
      ) : (
        <Text style={styles.count}>
          {results === null ? 'Searching…' : plural(results.length, 'result')}
        </Text>
      )}

      {searching && results === null ? (
        <View style={styles.skeletons}>
          <Skeleton width="47%" height={250} radius={18} />
          <Skeleton width="47%" height={250} radius={18} />
        </View>
      ) : (
        <FlatList
          data={showing}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <ProductCard product={item} />}
          ListEmptyComponent={
            searching ? (
              <EmptyState
                emoji="🔍"
                title={`No match for "${query.trim()}"`}
                message="We currently make four packs — sambar, kara kuzhambu and two chutneys. Try one of those."
                actionLabel="Clear search"
                onAction={() => setQuery('')}
              />
            ) : null
          }
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  back: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  backGlyph: { fontSize: 32, lineHeight: 34, color: colors.ink, marginTop: -4 },
  field: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: MIN_TOUCH + 4,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: radius.md,
  },
  glyph: { fontSize: 19, color: colors.green700, fontWeight: '700' },
  input: { flex: 1, fontSize: 15, color: colors.ink },
  clear: { fontSize: 22, lineHeight: 24, color: colors.mutedLight, paddingHorizontal: 2 },

  suggestBlock: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  suggestLabel: { ...type.caption, color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.8 },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginTop: spacing.md },
  suggestion: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.green50,
    borderWidth: 1,
    borderColor: colors.line,
  },
  suggestionText: { ...type.small, fontWeight: '700', color: colors.green800 },
  allLabel: { ...type.h3, color: colors.ink, marginTop: spacing.xxl },

  count: { ...type.small, color: colors.muted, paddingHorizontal: spacing.lg, paddingBottom: spacing.md },

  grid: { paddingHorizontal: spacing.lg, paddingBottom: spacing.section },
  row: { gap: spacing.md, marginBottom: spacing.md },
  skeletons: { flexDirection: 'row', gap: spacing.md, paddingHorizontal: spacing.lg },
});
