import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  CategoryTile,
  PromiseRow,
  PromoCarousel,
  SearchBar,
  TrustStrip,
} from '@/components/HomeParts';
import { ProductCard } from '@/components/ProductCard';
import { Screen, SectionHeader, Skeleton } from '@/components/ui';
import { listAddresses, type Address } from '@/lib/addresses';
import { listCategories, listFeatured, type Product } from '@/lib/catalogue';
import { getRecentlyViewed } from '@/store/preferences';
import { useAuth } from '@/store/auth';
import { colors, radius, spacing, type } from '@/theme';

/**
 * Commerce-first home. Deliberately not the website landing page: no problem
 * section, no technology wall, no testimonials. Those belong in onboarding and
 * Profile. This screen exists to get someone to a pack.
 */
export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const categories = listCategories();

  const [products, setProducts] = useState<Product[] | null>(null);
  const [recent, setRecent] = useState<Product[]>([]);
  const [address, setAddress] = useState<Address | null>(null);

  useEffect(() => {
    let cancelled = false;
    listFeatured()
      .then((list) => !cancelled && setProducts(list))
      .catch(() => !cancelled && setProducts([]));
    return () => {
      cancelled = true;
    };
  }, []);

  // The delivery line shows the signed-in customer's default address. Signed
  // out we only know the service area, so we say that instead of inventing one.
  useEffect(() => {
    if (!user) {
      setAddress(null);
      return;
    }
    let cancelled = false;
    listAddresses()
      .then((list) => {
        if (cancelled) return;
        setAddress(list.find((a) => a.is_default) ?? list[0] ?? null);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        const [ids, all] = await Promise.all([getRecentlyViewed(), listFeatured()]);
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

  const deliveryLabel = address
    ? `${address.area || address.house_no}, ${address.city}`
    : 'Chennai, Tamil Nadu';
  const deliveryHint = address ? address.label || 'Saved address' : 'Serving Chennai';

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Delivery + account, on the dark band so the app doesn't open on white */}
        <View style={styles.header}>
          <Pressable
            onPress={() => router.push(user ? '/addresses' : '/login')}
            accessibilityRole="button"
            accessibilityLabel={`Delivering to ${deliveryLabel}. Change address`}
            style={({ pressed }) => [styles.delivery, pressed && { opacity: 0.7 }]}
          >
            <Text style={styles.deliveryHint}>{deliveryHint}</Text>
            <View style={styles.deliveryRow}>
              <Ionicons name="location" size={15} color={colors.sprout} />
              <Text style={styles.deliveryText} numberOfLines={1}>
                {deliveryLabel}
              </Text>
              <Ionicons name="chevron-down" size={13} color={colors.onDarkMuted} />
            </View>
          </Pressable>

          <Pressable
            onPress={() => router.push(user ? '/(tabs)/profile' : '/login')}
            accessibilityRole="button"
            accessibilityLabel={user ? 'Your profile' : 'Sign in'}
            style={({ pressed }) => [styles.avatar, pressed && { opacity: 0.7 }]}
          >
            {user ? (
              <Text style={styles.avatarText}>{user.name.trim().charAt(0).toUpperCase()}</Text>
            ) : (
              <Ionicons name="person-outline" size={18} color={colors.bark} />
            )}
          </Pressable>
        </View>

        <View style={styles.searchSlot}>
          <SearchBar onPress={() => router.push('/search')} />
        </View>

        <View style={styles.block}>
          <PromoCarousel />
        </View>

        <View style={styles.blockTight}>
          <PromiseRow />
        </View>

        <View style={styles.block}>
          <SectionHeader
            title="Shop by category"
            eyebrow="Four dishes, done properly"
            style={styles.sectionPad}
          />
          <View style={styles.tiles}>
            {categories.map((category) => (
              <CategoryTile key={category.id} category={category} />
            ))}
          </View>
        </View>

        <View style={styles.block}>
          <SectionHeader
            title="Our packs"
            actionLabel="See all"
            onAction={() => router.push('/(tabs)/categories')}
            style={styles.sectionPad}
          />
          {products === null ? (
            <View style={styles.railSkeleton}>
              <Skeleton width={210} height={272} radius={radius.lg} />
              <Skeleton width={210} height={272} radius={radius.lg} />
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

        <View style={styles.block}>
          <TrustStrip />
        </View>

        {recent.length > 0 ? (
          <View style={styles.block}>
            <SectionHeader title="Recently viewed" style={styles.sectionPad} />
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

        <View style={styles.footer}>
          <Text style={styles.footerLine}>Sourced from farms in Kanchipuram</Text>
          <Text style={styles.footerMeta}>
            Cold chain 2–8°C · MAP packaging · FSSAI 22426421000333
          </Text>
        </View>
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
    gap: spacing.md,
    backgroundColor: colors.bark,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  delivery: { flex: 1 },
  deliveryHint: { ...type.eyebrow, fontSize: 9.5, color: colors.onDarkMuted },
  deliveryRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3 },
  deliveryText: { ...type.h3, color: colors.onDark, flexShrink: 1 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.sprout,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { ...type.h3, color: colors.bark, includeFontPadding: false },

  // Pull the search bar up so it straddles the dark band and the cream page.
  searchSlot: { marginTop: -26 },

  block: { marginTop: spacing.section },
  blockTight: { marginTop: spacing.xxl },
  sectionPad: { paddingHorizontal: spacing.lg },

  tiles: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: spacing.md },

  rail: { paddingHorizontal: spacing.lg, paddingVertical: spacing.xs },
  railSkeleton: { flexDirection: 'row', gap: spacing.md, paddingHorizontal: spacing.lg },

  footer: { marginTop: spacing.hero, alignItems: 'center', paddingHorizontal: spacing.xxl },
  footerLine: { ...type.serifMd, color: colors.sage },
  footerMeta: { ...type.tiny, fontSize: 10.5, color: colors.faint, marginTop: 4, textAlign: 'center' },
});
