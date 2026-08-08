import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CategoryTile, PromoCarousel, SearchBar, TrustStrip } from '@/components/HomeParts';
import { ProductCard } from '@/components/ProductCard';
import { Screen, SectionHeader, Skeleton } from '@/components/ui';
import { listCategories, listFeatured, type Product } from '@/lib/catalogue';
import { getRecentlyViewed } from '@/store/preferences';
import { colors, spacing, type } from '@/theme';

/**
 * Commerce-first home. Deliberately *not* the website landing page: no problem
 * section, no technology wall, no testimonials. Those live in onboarding and
 * Profile. This screen exists to get someone to a product.
 */
export default function Home() {
  const router = useRouter();
  const categories = listCategories();

  const [products, setProducts] = useState<Product[] | null>(null);
  const [recent, setRecent] = useState<Product[]>([]);

  useEffect(() => {
    let cancelled = false;
    listFeatured()
      .then((list) => {
        if (!cancelled) setProducts(list);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Recompute on focus — the user may have viewed something and come back.
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        const ids = await getRecentlyViewed();
        const all = await listFeatured();
        if (cancelled) return;
        setRecent(
          ids.map((id) => all.find((p) => p.id === id)).filter((p): p is Product => Boolean(p))
        );
      })();
      return () => {
        cancelled = true;
      };
    }, [])
  );

  return (
    <Screen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        stickyHeaderIndices={[0]}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.deliverTo}>Delivering to</Text>
            <Text style={styles.city}>Chennai, Tamil Nadu</Text>
          </View>
          <Text style={styles.wordmark}>Samachify</Text>
        </View>

        <View style={styles.searchSlot}>
          <SearchBar onPress={() => router.push('/search')} />
        </View>

        <PromoCarousel />

        <View style={styles.trustSlot}>
          <TrustStrip />
        </View>

        <View style={styles.section}>
          <SectionHeader title="Shop by category" />
          <View style={styles.tiles}>
            {categories.map((category) => (
              <CategoryTile key={category.id} category={category} />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <SectionHeader
            title="Our packs"
            actionLabel="See all"
            onAction={() => router.push('/(tabs)/categories')}
          />
          {products === null ? (
            <View style={styles.railSkeleton}>
              <Skeleton width={200} height={230} radius={18} />
              <Skeleton width={200} height={230} radius={18} />
            </View>
          ) : (
            <FlatList
              horizontal
              data={products}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <ProductCard product={item} variant="rail" />}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.rail}
              ItemSeparatorComponent={() => <View style={{ width: spacing.md }} />}
            />
          )}
        </View>

        {recent.length > 0 ? (
          <View style={styles.section}>
            <SectionHeader title="Recently viewed" />
            <FlatList
              horizontal
              data={recent}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <ProductCard product={item} variant="rail" />}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.rail}
              ItemSeparatorComponent={() => <View style={{ width: spacing.md }} />}
            />
          </View>
        ) : null}

        <Text style={styles.footnote}>
          Fresh from farms in Kanchipuram · Cold chain 2–8°C · FSSAI 22426421000333
        </Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: spacing.section },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.cream,
  },
  deliverTo: { fontSize: 10.5, fontWeight: '700', color: colors.muted, letterSpacing: 0.6 },
  city: { ...type.h3, color: colors.ink, marginTop: 1 },
  wordmark: { fontSize: 15, fontWeight: '800', color: colors.green700, letterSpacing: -0.3 },

  searchSlot: { paddingBottom: spacing.lg, backgroundColor: colors.cream },
  trustSlot: { marginTop: spacing.xl },

  section: { marginTop: spacing.section, paddingHorizontal: spacing.lg },
  tiles: { flexDirection: 'row', justifyContent: 'space-between' },

  rail: { paddingVertical: spacing.xs },
  railSkeleton: { flexDirection: 'row', gap: spacing.md },

  footnote: {
    ...type.small,
    color: colors.mutedLight,
    textAlign: 'center',
    marginTop: spacing.section,
    paddingHorizontal: spacing.xxl,
  },
});
