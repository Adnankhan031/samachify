import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Badge,
  Button,
  Card,
  Divider,
  ErrorState,
  QuantityStepper,
  Screen,
  ScreenHeader,
  SectionHeader,
  Skeleton,
} from '@/components/ui';
import { getProduct, getRecipe, type Product, type Recipe } from '@/lib/catalogue';
import { inr } from '@/lib/format';
import { pushRecentlyViewed } from '@/store/preferences';
import { useCart } from '@/store/cart';
import { colors, radius, shadow, spacing, type } from '@/theme';

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { quantityOf, addItem, updateQuantity } = useCart();

  const [product, setProduct] = useState<Product | null | undefined>(undefined);
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    (async () => {
      const [p, r] = await Promise.all([getProduct(id), getRecipe(id)]);
      if (cancelled) return;
      setProduct(p);
      setRecipe(r);
      if (p) void pushRecentlyViewed(p.id);
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (product === undefined) {
    return (
      <Screen>
        <ScreenHeader title="Loading…" />
        <View style={styles.loading}>
          <Skeleton height={260} radius={24} />
          <Skeleton width="60%" height={24} />
          <Skeleton width="90%" height={16} />
          <Skeleton width="80%" height={16} />
        </View>
      </Screen>
    );
  }

  if (product === null) {
    return (
      <Screen>
        <ScreenHeader title="Not found" />
        <ErrorState
          message="We couldn't find that pack. It may have been renamed."
          onRetry={() => router.replace('/(tabs)/categories')}
        />
      </Screen>
    );
  }

  const quantity = quantityOf(product.id);

  const add = () =>
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });

  return (
    <Screen>
      <ScreenHeader title={product.name} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 130 }]}
      >
        {/* Gallery — swipe when there is more than one shot. */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.gallery}
        >
          {product.gallery.map((source, i) => (
            <Image
              key={i}
              source={source}
              style={[styles.galleryImage, { width: width - spacing.lg * 2 }]}
              contentFit="cover"
              transition={200}
            />
          ))}
        </ScrollView>

        <View style={styles.body}>
          <View style={styles.tagRow}>
            {product.spiceLevel ? <Badge label={product.spiceLevel} tone="lime" /> : null}
            {product.dietType ? <Badge label={product.dietType} tone="success" /> : null}
            {product.isOnePort ? <Badge label="One-Pot" tone="neutral" /> : null}
          </View>

          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.subtitle}>{product.subtitle}</Text>
          <Text style={styles.price}>{inr(product.price)}</Text>

          <Card style={styles.facts} padded={false}>
            <Fact label="Serves" value={`${product.servings} people`} />
            <View style={styles.factDivider} />
            <Fact label="Prep time" value={recipe?.prepTime ?? '—'} />
            <View style={styles.factDivider} />
            <Fact label="Cook time" value={product.cookTime} />
          </Card>

          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.section}>
            <SectionHeader title="What's inside" />
            <Card>
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
                <SectionHeader title={`How to cook ${recipe.name}`} />
                <Card style={styles.steps}>
                  {recipe.steps.map((step, i) => (
                    <View key={i} style={styles.step}>
                      <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>{i + 1}</Text>
                      </View>
                      <Text style={styles.stepText}>{step}</Text>
                    </View>
                  ))}
                </Card>
              </View>

              <View style={styles.section}>
                <SectionHeader title="Nutrition" />
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
                <Text style={styles.nutritionNote}>
                  Approximate values for the full pack ({recipe.servings} servings).
                </Text>
              </View>

              <View style={styles.section}>
                <SectionHeader title="Why it's good" />
                <Card>
                  {product.highlights.map((highlight) => (
                    <View key={highlight} style={styles.highlight}>
                      <Text style={styles.tick}>✓</Text>
                      <Text style={styles.highlightText}>{highlight}</Text>
                    </View>
                  ))}
                </Card>
              </View>

              <Card style={styles.tradition}>
                <Text style={styles.traditionLabel}>From our kitchen</Text>
                <Text style={styles.traditionText}>{recipe.traditionNote}</Text>
              </Card>
            </>
          ) : null}
        </View>
      </ScrollView>

      {/* Sticky buy bar — always reachable without scrolling back up. */}
      <View style={[styles.bar, { paddingBottom: insets.bottom + spacing.md }]}>
        <View>
          <Text style={styles.barLabel}>{product.name}</Text>
          <Text style={styles.barPrice}>{inr(product.price)}</Text>
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
          <Button label="Add to cart" size="lg" onPress={add} style={styles.barButton} />
        )}
      </View>
    </Screen>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fact}>
      <Text style={styles.factValue}>{value}</Text>
      <Text style={styles.factLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: { padding: spacing.lg, gap: spacing.md },
  content: { paddingBottom: spacing.section },

  gallery: { paddingHorizontal: spacing.lg },
  galleryImage: {
    height: 260,
    borderRadius: radius.lg,
    backgroundColor: colors.green50,
    marginRight: spacing.md,
  },

  body: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl },
  tagRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  name: { ...type.display, color: colors.ink },
  subtitle: { ...type.body, color: colors.muted, marginTop: spacing.xs },
  price: { fontSize: 26, fontWeight: '800', color: colors.ink, marginTop: spacing.md },

  facts: { flexDirection: 'row', marginTop: spacing.xl, paddingVertical: spacing.lg },
  fact: { flex: 1, alignItems: 'center' },
  factDivider: { width: 1, backgroundColor: colors.line },
  factValue: { ...type.bodyStrong, color: colors.ink },
  factLabel: { ...type.caption, color: colors.muted, marginTop: 2 },

  description: { ...type.body, color: colors.ink80, lineHeight: 23, marginTop: spacing.xl },

  section: { marginTop: spacing.section },

  ingredient: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.md },
  ingredientIcon: { fontSize: 20 },
  ingredientBody: { flex: 1 },
  ingredientName: { ...type.small, fontWeight: '700', color: colors.ink },
  ingredientNote: { ...type.caption, fontWeight: '400', color: colors.mutedLight, marginTop: 1 },
  ingredientAmount: { ...type.caption, color: colors.green700 },

  steps: { gap: spacing.lg },
  step: { flexDirection: 'row', gap: spacing.md },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.green50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: { fontSize: 12, fontWeight: '800', color: colors.green700 },
  stepText: { ...type.small, lineHeight: 20, color: colors.ink80, flex: 1 },

  nutrition: { flexDirection: 'row', justifyContent: 'space-between' },
  nutrient: { alignItems: 'center', flex: 1 },
  nutrientValue: { ...type.small, fontWeight: '800', color: colors.ink },
  nutrientLabel: { ...type.caption, fontWeight: '400', color: colors.muted, marginTop: 2 },
  nutritionNote: { ...type.caption, fontWeight: '400', color: colors.mutedLight, marginTop: spacing.sm },

  highlight: { flexDirection: 'row', gap: spacing.md, paddingVertical: spacing.sm },
  tick: { color: colors.green700, fontWeight: '800' },
  highlightText: { ...type.small, color: colors.ink80, flex: 1 },

  tradition: { marginTop: spacing.section, backgroundColor: colors.green50 },
  traditionLabel: {
    ...type.caption,
    color: colors.green700,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  traditionText: { ...type.small, lineHeight: 21, color: colors.green900 },

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
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    ...shadow.md,
  },
  barLabel: { ...type.caption, color: colors.muted },
  barPrice: { ...type.h2, color: colors.ink },
  barButton: { flex: 1 },
  barActions: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
});
