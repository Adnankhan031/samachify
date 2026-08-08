import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';

import type { Category } from '@/lib/catalogue';
import { heroImages, products as allProducts } from '@/data/products';
import { colors, radius, shadow, spacing, type } from '@/theme';

/**
 * Promotional carousel. Every line is real Samachify copy taken from the website
 * (hero H1, the "No Washing" row) or from real pricing rules — no invented claims.
 */
const SLIDES = [
  {
    id: 'farm-to-pan',
    eyebrow: "South India's First",
    title: 'From Farm To Pan',
    body: 'Fresh ingredient meal kits, delivered ready to cook.',
    image: heroImages.all,
  },
  {
    id: 'no-prep',
    eyebrow: 'No Washing. No Cutting.',
    title: 'No Guesswork.',
    body: 'Pre-cut, pre-measured and inspected before it reaches you.',
    image: heroImages.sambar,
  },
  {
    id: 'free-delivery',
    eyebrow: 'Ready in 10–15 minutes',
    title: 'Free delivery over ₹299',
    body: '0% preservatives. 100% farm fresh. FSSAI certified.',
    image: heroImages.chutney,
  },
] as const;

export function PromoCarousel() {
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const slideWidth = width - spacing.lg * 2;
  const lastIndex = useRef(0);

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const next = Math.round(e.nativeEvent.contentOffset.x / (slideWidth + spacing.md));
      if (next !== lastIndex.current) {
        lastIndex.current = next;
        setIndex(next);
      }
    },
    [slideWidth]
  );

  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled={false}
        snapToInterval={slideWidth + spacing.md}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.carouselContent}
      >
        {SLIDES.map((slide) => (
          <View key={slide.id} style={[styles.slide, { width: slideWidth }]}>
            <Image source={slide.image} style={StyleSheet.absoluteFill} contentFit="cover" />
            <LinearGradient
              colors={['rgba(11,22,6,0.88)', 'rgba(11,22,6,0.42)']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.slideBody}>
              <Text style={styles.slideEyebrow}>{slide.eyebrow}</Text>
              <Text style={styles.slideTitle}>{slide.title}</Text>
              <Text style={styles.slideText}>{slide.body}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.dots} accessibilityElementsHidden>
        {SLIDES.map((slide, i) => (
          <View key={slide.id} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

/** The four trust metrics from the website hero. */
export function TrustStrip() {
  const items = [
    { metric: '10–15', label: 'Min to cook' },
    { metric: '100%', label: 'Farm fresh' },
    { metric: '0%', label: 'Preservatives' },
    { metric: 'FSSAI', label: 'Certified' },
  ];

  return (
    <View style={styles.trust}>
      {items.map((item) => (
        <View key={item.label} style={styles.trustItem}>
          <Text style={styles.trustMetric}>{item.metric}</Text>
          <Text style={styles.trustLabel}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

/** Category tile — uses a real product shot from that category as the artwork. */
export function CategoryTile({ category }: { category: Category }) {
  const router = useRouter();
  const sample = allProducts.find((p) => p.category === category.id);

  return (
    <Pressable
      onPress={() => router.push(`/category/${category.id}`)}
      accessibilityRole="button"
      accessibilityLabel={`Browse ${category.label}`}
      style={({ pressed }) => [styles.tile, pressed && { transform: [{ scale: 0.97 }] }]}
    >
      <View style={styles.tileImageWrap}>
        {sample ? (
          <Image source={sample.image} style={styles.tileImage} contentFit="cover" />
        ) : null}
      </View>
      <Text style={styles.tileLabel} numberOfLines={1}>
        {category.label}
      </Text>
    </Pressable>
  );
}

/** Tappable search affordance on Home — navigates to the real search screen. */
export function SearchBar({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="search"
      accessibilityLabel="Search meal kits and chutneys"
      style={({ pressed }) => [styles.searchBar, pressed && { opacity: 0.8 }]}
    >
      <Text style={styles.searchGlyph}>⌕</Text>
      <Text style={styles.searchPlaceholder}>Search meal kits, chutneys…</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  carouselContent: { paddingHorizontal: spacing.lg, gap: spacing.md },
  slide: {
    height: 176,
    borderRadius: radius.lg,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    backgroundColor: colors.green900,
  },
  slideBody: { padding: spacing.xl },
  slideEyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: colors.lime,
    marginBottom: spacing.xs,
  },
  slideTitle: { fontSize: 23, fontWeight: '800', color: colors.white, letterSpacing: -0.4 },
  slideText: { fontSize: 12.5, lineHeight: 18, color: 'rgba(255,255,255,0.85)', marginTop: 4 },

  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: spacing.md },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.line },
  dotActive: { width: 18, backgroundColor: colors.green700 },

  trust: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    paddingVertical: spacing.lg,
    marginHorizontal: spacing.lg,
    ...shadow.sm,
  },
  trustItem: { flex: 1, alignItems: 'center' },
  trustMetric: { fontSize: 15, fontWeight: '800', color: colors.green700 },
  trustLabel: { fontSize: 10, color: colors.muted, marginTop: 2 },

  tile: { width: 88, alignItems: 'center' },
  tileImageWrap: {
    width: 76,
    height: 76,
    borderRadius: 38,
    overflow: 'hidden',
    backgroundColor: colors.green50,
    borderWidth: 1.5,
    borderColor: colors.line,
  },
  tileImage: { width: '100%', height: '100%' },
  tileLabel: {
    ...type.small,
    fontWeight: '700',
    color: colors.ink80,
    marginTop: spacing.sm,
    textAlign: 'center',
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    height: 48,
    marginHorizontal: spacing.lg,
    ...shadow.sm,
  },
  searchGlyph: { fontSize: 20, color: colors.green700, fontWeight: '700' },
  searchPlaceholder: { ...type.body, color: colors.mutedLight },
});
