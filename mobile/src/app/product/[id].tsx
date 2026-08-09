import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductCard } from '@/components/ProductCard';
import {
  Badge,
  Button,
  Card,
  Divider,
  ErrorState,
  QuantityStepper,
  Screen,
  SectionHeader,
  Skeleton,
  SpiceDots,
} from '@/components/ui';
import { getProduct, getRecipe, listProducts, type Product, type Recipe } from '@/lib/catalogue';
import { inr } from '@/lib/format';
import { useCart } from '@/store/cart';
import { pushRecentlyViewed } from '@/store/preferences';
import { colors, radius, shadow, spacing, type } from '@/theme';

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { quantityOf, addItem, updateQuantity, totalItems } = useCart();

  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    (async () => {
      const [p, r, all] = await Promise.all([getProduct(id), getRecipe(id), listProducts()]);
      if (cancelled) return;
      setProduct(p);
      setRecipe(r);
      setRelated(all.filter((item) => item.id !== id));
      if (p) void pushRecentlyViewed(p.id);
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (product === undefined) {
    return (
      <Screen>
        <View style={styles.loading}>
          <Skeleton height={300} radius={radius.xl} />
          <Skeleton width="65%" height={28} />
          <Skeleton width="90%" height={16} />
          <Skeleton width="80%" height={16} />
        </View>
      </Screen>
    );
  }

  if (product === null) {
    return (
      <Screen>
        <ErrorState
          message="We couldn't find that pack."
          onRetry={() => router.replace('/(tabs)/categories')}
        />
      </Screen>
    );
  }

  const quantity = quantityOf(product.id);
  const galleryWidth = width;

  const add = () =>
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });

  const onGalleryScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / galleryWidth);
    setSlide((current) => (next !== current ? next : current));
  };

  return (
    <Screen edges="none">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 140 }}
      >
        {/* Full-bleed gallery with the header floating over it. */}
        <View>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={onGalleryScroll}
            scrollEventThrottle={16}
          >
            {product.gallery.map((source, i) => (
              <Image
                key={i}
                source={source}
                style={{ width: galleryWidth, height: 330, backgroundColor: colors.wash }}
                contentFit="cover"
                transition={200}
              />
            ))}
          </ScrollView>

          <LinearGradient
            colors={['rgba(11,22,6,0.55)', 'transparent']}
            style={[styles.scrim, { height: insets.top + 70 }]}
            pointerEvents="none"
          />

          <View style={[styles.floatingBar, { top: insets.top + spacing.sm }]}>
            <Pressable
              onPress={() => (router.canGoBack() ? router.back() : router.replace('/(tabs)'))}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              style={({ pressed }) => [styles.floatBtn, pressed && { opacity: 0.7 }]}
            >
              <Ionicons name="chevron-back" size={21} color={colors.ink} />
            </Pressable>

            <Pressable
              onPress={() => router.push('/(tabs)/cart')}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel={`Cart, ${totalItems} items`}
              style={({ pressed }) => [styles.floatBtn, pressed && { opacity: 0.7 }]}
            >
              <Ionicons name="cart-outline" size={20} color={colors.ink} />
              {totalItems > 0 ? (
                <View style={styles.floatBadge}>
                  <Text style={styles.floatBadgeText}>{totalItems > 9 ? '9+' : totalItems}</Text>
                </View>
              ) : null}
            </Pressable>
          </View>

          {product.gallery.length > 1 ? (
            <View style={styles.dots}>
              {product.gallery.map((_, i) => (
                <View key={i} style={[styles.dot, i === slide && styles.dotOn]} />
              ))}
            </View>
          ) : null}
        </View>

        {/* Sheet lifts over the image edge. */}
        <View style={styles.sheet}>
          <View style={styles.tagRow}>
            {product.spiceLevel ? <SpiceDots level={product.spiceLevel} /> : null}
            {product.dietType ? <Badge label={product.dietType} tone="success" icon="leaf" /> : null}
            {product.isOnePort ? <Badge label="One-pot" tone="neutral" /> : null}
          </View>

          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.subtitle}>{product.subtitle}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>{inr(product.price)}</Text>
            <Text style={styles.priceNote}>per pack · serves {product.servings}</Text>
          </View>

          <Card style={styles.facts} padded={false}>
            <Fact icon="people-outline" value={`${product.servings}`} label="Serves" />
            <View style={styles.factDivider} />
            <Fact icon="hourglass-outline" value={recipe?.prepTime ?? '—'} label="Prep" />
            <View style={styles.factDivider} />
            <Fact icon="timer-outline" value={product.cookTime.replace(/\s*mins?$/i, '')} label="Cook (min)" />
          </Card>

          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.section}>
            <SectionHeader title="What's inside" eyebrow="Everything pre-cut and measured" />
            <Card padded={false} style={styles.listCard}>
              {(recipe?.includedIngredients ?? []).map((ingredient, i, arr) => (
                <View key={`${ingredient.name}-${i}`}>
                  <View style={styles.ingredient}>
                    <Text style={styles.ingredientIcon}>{ingredient.icon}</Text>
                    <View style={styles.ingredientBody}>
                      <Text style={styles.ingredientName}>{ingredient.name}</Text>
                      {ingredient.note ? (
                        <Text style={styles.ingredientNote}>{ingredient.note}</Text>
                      ) : null}
                    </View>
                    <Text style={styles.ingredientAmount}>{ingredient.amount}</Text>
                  </View>
                  {i < arr.length - 1 ? <Divider /> : null}
                </View>
              ))}
            </Card>
          </View>

          {recipe ? (
            <>
              <View style={styles.section}>
                <SectionHeader
                  title={`How to cook ${recipe.name}`}
                  eyebrow={`${recipe.difficulty} · ${recipe.steps.length} steps`}
                />
                {recipe.steps.map((step, i) => (
                  <View key={i} style={styles.step}>
                    <View style={styles.stepRail}>
                      <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>{i + 1}</Text>
                      </View>
                      {i < recipe.steps.length - 1 ? <View style={styles.stepLine} /> : null}
                    </View>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.section}>
                <SectionHeader title="Nutrition" eyebrow={`Full pack · ${recipe.servings} servings`} />
                <Card style={styles.nutrition}>
                  {[
                    ['Calories', recipe.nutrition.calories],
                    ['Carbs', recipe.nutrition.carbs],
                    ['Protein', recipe.nutrition.protein],
                    ['Fat', recipe.nutrition.fat],
                    ['Fibre', recipe.nutrition.fiber],
                  ].map(([label, value]) => (
                    <View key={label} style={styles.nutrient}>
                      <Text style={styles.nutrientValue}>{value}</Text>
                      <Text style={styles.nutrientLabel}>{label}</Text>
                    </View>
                  ))}
                </Card>
              </View>

              <View style={styles.section}>
                <SectionHeader title="Why it's good" />
                <Card>
                  {product.highlights.map((highlight, i) => (
                    <View key={highlight} style={[styles.highlight, i > 0 && styles.highlightGap]}>
                      <Ionicons name="checkmark-circle" size={17} color={colors.leaf} />
                      <Text style={styles.highlightText}>{highlight}</Text>
                    </View>
                  ))}
                </Card>
              </View>

              <Card tone="dark" style={styles.tradition}>
                <Text style={styles.traditionLabel}>From our kitchen</Text>
                <Text style={styles.traditionText}>{recipe.traditionNote}</Text>
              </Card>
            </>
          ) : null}

          {related.length > 0 ? (
            <View style={styles.section}>
              <SectionHeader title="Pairs well with" />
              <FlatList
                horizontal
                data={related}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ProductCard product={item} variant="rail" />}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ width: spacing.md }} />}
              />
            </View>
          ) : null}
        </View>
      </ScrollView>

      <View style={[styles.bar, { paddingBottom: insets.bottom + spacing.md }]}>
        <View>
          <Text style={styles.barLabel} numberOfLines={1}>
            {product.name}
          </Text>
          <Text style={styles.barPrice}>{inr(product.price * Math.max(1, quantity))}</Text>
        </View>

        {quantity > 0 ? (
          <View style={styles.barActions}>
            <QuantityStepper
              quantity={quantity}
              label={product.name}
              onChange={(next) => updateQuantity(product.id, next)}
            />
            <Button
              label="View cart"
              size="lg"
              onPress={() => router.push('/(tabs)/cart')}
              style={{ flex: 1 }}
            />
          </View>
        ) : (
          <Button label="Add to cart" icon="add" size="lg" onPress={add} style={styles.barButton} />
        )}
      </View>
    </Screen>
  );
}

function Fact({
  icon,
  value,
  label,
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  value: string;
  label: string;
}) {
  return (
    <View style={styles.fact}>
      <Ionicons name={icon} size={15} color={colors.leaf} />
      <Text style={styles.factValue}>{value}</Text>
      <Text style={styles.factLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: { padding: spacing.lg, gap: spacing.md, paddingTop: spacing.hero },

  scrim: { position: 'absolute', top: 0, left: 0, right: 0 },
  floatingBar: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  floatBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.94)',
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  floatBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    paddingHorizontal: 4,
    backgroundColor: colors.leaf,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.paper,
  },
  floatBadgeText: { ...type.tiny, fontSize: 9, lineHeight: 12, color: colors.onDark },

  dots: {
    position: 'absolute',
    bottom: spacing.xxxl,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.5)' },
  dotOn: { width: 18, backgroundColor: colors.onDark },

  sheet: {
    backgroundColor: colors.cream,
    borderTopLeftRadius: radius.hero,
    borderTopRightRadius: radius.hero,
    marginTop: -24,
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  tagRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  name: { ...type.display, color: colors.ink },
  subtitle: { ...type.body, color: colors.muted, marginTop: spacing.xs },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm, marginTop: spacing.lg },
  price: { ...type.priceLg, color: colors.ink },
  priceNote: { ...type.tiny, color: colors.faint },

  facts: { flexDirection: 'row', marginTop: spacing.xl, paddingVertical: spacing.lg },
  fact: { flex: 1, alignItems: 'center', gap: 3 },
  factDivider: { width: 1, backgroundColor: colors.line },
  factValue: { ...type.price, fontSize: 15, color: colors.ink },
  factLabel: { ...type.tiny, fontSize: 10, color: colors.muted },

  description: { ...type.body, color: colors.ink80, marginTop: spacing.xl },
  section: { marginTop: spacing.section },
  listCard: { paddingHorizontal: spacing.lg },

  ingredient: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  ingredientIcon: { fontSize: 19 },
  ingredientBody: { flex: 1 },
  ingredientName: { ...type.smallStrong, color: colors.ink },
  ingredientNote: { ...type.tiny, fontSize: 10.5, color: colors.faint, marginTop: 1 },
  ingredientAmount: { ...type.priceSm, fontSize: 12, color: colors.leaf },

  step: { flexDirection: 'row', gap: spacing.md },
  stepRail: { alignItems: 'center', width: 28 },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.leaf,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: { ...type.tiny, fontSize: 12, color: colors.onDark, includeFontPadding: false },
  stepLine: { width: 2, flex: 1, backgroundColor: colors.lineStrong, marginVertical: 4 },
  stepText: { ...type.small, color: colors.ink80, flex: 1, paddingBottom: spacing.xl, paddingTop: 4 },

  nutrition: { flexDirection: 'row', justifyContent: 'space-between' },
  nutrient: { alignItems: 'center', flex: 1 },
  nutrientValue: { ...type.priceSm, fontSize: 13, color: colors.ink },
  nutrientLabel: { ...type.tiny, fontSize: 10, color: colors.muted, marginTop: 2 },

  highlight: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  highlightGap: { marginTop: spacing.md },
  highlightText: { ...type.small, color: colors.ink80, flex: 1 },

  tradition: { marginTop: spacing.section },
  traditionLabel: { ...type.eyebrow, color: colors.sprout, marginBottom: spacing.sm },
  traditionText: { ...type.small, lineHeight: 21, color: colors.onDarkMuted },

  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    backgroundColor: colors.paper,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    ...shadow.lifted,
  },
  barLabel: { ...type.tiny, color: colors.muted, maxWidth: 120 },
  barPrice: { ...type.priceLg, fontSize: 21, lineHeight: 26, color: colors.ink },
  barButton: { flex: 1 },
  barActions: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
});
