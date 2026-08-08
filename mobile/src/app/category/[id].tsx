import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { ProductCard } from '@/components/ProductCard';
import { EmptyState, Screen, ScreenHeader, Skeleton } from '@/components/ui';
import { listByCategory, listCategories, type Product } from '@/lib/catalogue';
import { plural } from '@/lib/format';
import { spacing } from '@/theme';

export default function CategoryProducts() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const label = useMemo(
    () => listCategories().find((c) => c.id === id)?.label ?? 'Packs',
    [id]
  );

  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    listByCategory(id)
      .then((list) => !cancelled && setProducts(list))
      .catch(() => !cancelled && setProducts([]));
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <Screen>
      <ScreenHeader
        title={label}
        subtitle={products ? plural(products.length, 'pack') : undefined}
      />

      {products === null ? (
        <View style={styles.skeletons}>
          <Skeleton width="47%" height={250} radius={18} />
          <Skeleton width="47%" height={250} radius={18} />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <ProductCard product={item} />}
          ListEmptyComponent={
            <EmptyState
              emoji="🍲"
              title="Nothing in this category"
              message="We're not making packs in this category right now."
              actionLabel="See all packs"
              onAction={() => router.replace('/(tabs)/categories')}
            />
          }
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  grid: { paddingHorizontal: spacing.lg, paddingBottom: spacing.section },
  row: { gap: spacing.md, marginBottom: spacing.md },
  skeletons: { flexDirection: 'row', gap: spacing.md, paddingHorizontal: spacing.lg },
});
