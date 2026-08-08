import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { ProductCard } from '@/components/ProductCard';
import { Chip, EmptyState, Screen, Skeleton } from '@/components/ui';
import { listCategories, listProducts, type Product } from '@/lib/catalogue';
import { plural } from '@/lib/format';
import { colors, spacing, type } from '@/theme';

const ALL = 'all';

/** Browse everything, filtered by the real categories the catalogue defines. */
export default function Categories() {
  const router = useRouter();
  const categories = useMemo(() => [{ id: ALL, label: 'All packs' }, ...listCategories()], []);

  const [products, setProducts] = useState<Product[] | null>(null);
  const [active, setActive] = useState<string>(ALL);

  useEffect(() => {
    let cancelled = false;
    listProducts()
      .then((list) => !cancelled && setProducts(list))
      .catch(() => !cancelled && setProducts([]));
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!products) return [];
    return active === ALL ? products : products.filter((p) => p.category === active);
  }, [products, active]);

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>All packs</Text>
        <Text style={styles.subtitle}>
          {products ? plural(filtered.length, 'pack') : 'Loading…'}
        </Text>
      </View>

      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        style={styles.chipRow}
        renderItem={({ item }) => (
          <Chip label={item.label} active={active === item.id} onPress={() => setActive(item.id)} />
        )}
        ItemSeparatorComponent={() => <View style={{ width: spacing.sm }} />}
      />

      {products === null ? (
        <View style={styles.skeletonGrid}>
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} width="47%" height={250} radius={18} />
          ))}
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <ProductCard product={item} />}
          ListEmptyComponent={
            <EmptyState
              emoji="🍲"
              title="Nothing here yet"
              message="No packs in this category right now. Try another one."
              actionLabel="Show all packs"
              onAction={() => setActive(ALL)}
            />
          }
          ListFooterComponent={
            filtered.length > 0 ? (
              <Text style={styles.footnote} onPress={() => router.push('/search')}>
                Looking for something specific? Search the catalogue.
              </Text>
            ) : null
          }
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.lg },
  title: { ...type.h1, color: colors.ink },
  subtitle: { ...type.small, color: colors.muted, marginTop: 2 },

  chipRow: { flexGrow: 0 },
  chips: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },

  grid: { paddingHorizontal: spacing.lg, paddingBottom: spacing.section },
  row: { gap: spacing.md, marginBottom: spacing.md },

  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },

  footnote: {
    ...type.small,
    color: colors.green700,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
});
