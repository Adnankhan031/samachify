import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { ProductCard } from '@/components/ProductCard';
import { Chip, EmptyState, PageTitle, Screen, Skeleton } from '@/components/ui';
import { listCategories, listProducts, type Product } from '@/lib/catalogue';
import { plural } from '@/lib/format';
import { colors, radius, spacing, type } from '@/theme';

const ALL = 'all';

type SortKey = 'default' | 'price-asc' | 'price-desc';

const SORTS: { key: SortKey; label: string; icon: React.ComponentProps<typeof Ionicons>['name'] }[] = [
  { key: 'default', label: 'Featured', icon: 'sparkles-outline' },
  { key: 'price-asc', label: 'Price: low to high', icon: 'arrow-up-outline' },
  { key: 'price-desc', label: 'Price: high to low', icon: 'arrow-down-outline' },
];

/** Browse everything, filtered by the categories the catalogue actually defines. */
export default function Categories() {
  const router = useRouter();
  const categories = useMemo(() => [{ id: ALL, label: 'All packs' }, ...listCategories()], []);

  const [products, setProducts] = useState<Product[] | null>(null);
  const [active, setActive] = useState<string>(ALL);
  const [sort, setSort] = useState<SortKey>('default');
  const [sortOpen, setSortOpen] = useState(false);

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
    const base = active === ALL ? products : products.filter((p) => p.category === active);
    if (sort === 'price-asc') return [...base].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') return [...base].sort((a, b) => b.price - a.price);
    return base;
  }, [products, active, sort]);

  const sortLabel = SORTS.find((s) => s.key === sort)!.label;

  return (
    <Screen>
      <PageTitle
        title="All packs"
        subtitle={products ? plural(filtered.length, 'pack') : 'Loading…'}
        right={
          <Pressable
            onPress={() => router.push('/search')}
            accessibilityRole="button"
            accessibilityLabel="Search packs"
            style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.6 }]}
          >
            <Ionicons name="search" size={19} color={colors.ink} />
          </Pressable>
        }
      />

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

      {/* Sort is a real control, not decoration — price is the only orderable
          field the catalogue has, so those are the only options offered. */}
      <View style={styles.sortRow}>
        <Pressable
          onPress={() => setSortOpen((o) => !o)}
          accessibilityRole="button"
          accessibilityLabel={`Sorted by ${sortLabel}. Change sorting`}
          accessibilityState={{ expanded: sortOpen }}
          style={({ pressed }) => [styles.sortBtn, pressed && { opacity: 0.7 }]}
        >
          <Ionicons name="swap-vertical" size={14} color={colors.moss} />
          <Text style={styles.sortText}>{sortLabel}</Text>
          <Ionicons name={sortOpen ? 'chevron-up' : 'chevron-down'} size={13} color={colors.moss} />
        </Pressable>
      </View>

      {sortOpen ? (
        <View style={styles.sortSheet}>
          {SORTS.map((option) => (
            <Pressable
              key={option.key}
              onPress={() => {
                setSort(option.key);
                setSortOpen(false);
              }}
              accessibilityRole="radio"
              accessibilityState={{ selected: sort === option.key }}
              style={({ pressed }) => [styles.sortOption, pressed && { backgroundColor: colors.cream2 }]}
            >
              <Ionicons name={option.icon} size={16} color={colors.muted} />
              <Text style={styles.sortOptionText}>{option.label}</Text>
              {sort === option.key ? (
                <Ionicons name="checkmark" size={17} color={colors.leaf} />
              ) : null}
            </Pressable>
          ))}
        </View>
      ) : null}

      {products === null ? (
        <View style={styles.skeletonGrid}>
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} width="47%" height={272} radius={radius.lg} />
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
              icon="restaurant-outline"
              title="Nothing in this category"
              message="No packs here right now. Try another category."
              actionLabel="Show all packs"
              onAction={() => setActive(ALL)}
            />
          }
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },

  chipRow: { flexGrow: 0 },
  chips: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md },

  sortRow: { paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.wash,
    borderWidth: 1,
    borderColor: colors.lineStrong,
  },
  sortText: { ...type.tiny, fontSize: 11.5, color: colors.moss },

  sortSheet: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    backgroundColor: colors.paper,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  sortOptionText: { ...type.small, color: colors.ink, flex: 1 },

  grid: { paddingHorizontal: spacing.lg, paddingBottom: spacing.section },
  row: { gap: spacing.md, marginBottom: spacing.md },
  skeletonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
});
