import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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

import { heroImages, products as allProducts } from '@/data/products';
import type { Category } from '@/lib/catalogue';
import { colors, radius, shadow, spacing, type } from '@/theme';

/**
 * Promotional carousel. Every line is real Samachify copy — the site's hero H1,
 * the "No Washing" row, and the actual free-delivery threshold. No invented
 * claims, no fake percentages.
 */
const SLIDES = [
  {
    id: 'farm-to-pan',
    eyebrow: "South India's first",
    title: 'From Farm\nTo Pan',
    body: 'Fresh ingredient meal kits, delivered ready to cook.',
    image: heroImages.all,
  },
  {
    id: 'no-prep',
    eyebrow: 'No washing. No cutting.',
    title: 'No\nGuesswork',
    body: 'Pre-cut, pre-measured, inspected before it reaches you.',
    image: heroImages.sambar,
  },
  {
    id: 'free-delivery',
    eyebrow: 'On orders over ₹299',
    title: 'Free\nDelivery',
    body: '0% preservatives. 100% farm fresh. FSSAI certified.',
    image: heroImages.chutney,
  },
] as const;

const AUTOPLAY_MS = 5000;

export function PromoCarousel() {
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);
  const paused = useRef(false);
  const slideWidth = width - spacing.lg * 2;
  const stride = slideWidth + spacing.md;

  // Auto-advance, but stop the moment a finger lands so we never yank the
  // carousel out from under someone reading it.
  useEffect(() => {
    const timer = setInterval(() => {
      if (paused.current) return;
      setIndex((current) => {
        const next = (current + 1) % SLIDES.length;
        scrollRef.current?.scrollTo({ x: next * stride, animated: true });
        return next;
      });
    }, AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [stride]);

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const next = Math.round(e.nativeEvent.contentOffset.x / stride);
      setIndex((current) => (next !== current ? next : current));
    },
    [stride]
  );

  return (
    <View>
      <ScrollView
        ref={scrollRef}
        horizontal
        snapToInterval={stride}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        onTouchStart={() => (paused.current = true)}
        onMomentumScrollEnd={() => (paused.current = false)}
        scrollEventThrottle={16}
        contentContainerStyle={styles.carousel}
      >
        {SLIDES.map((slide) => (
          <View key={slide.id} style={[styles.slide, { width: slideWidth }]}>
            <Image source={slide.image} style={StyleSheet.absoluteFill} contentFit="cover" />
            <LinearGradient
              colors={['rgba(11,22,6,0.94)', 'rgba(11,22,6,0.62)', 'rgba(11,22,6,0.18)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0.6 }}
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
          <View key={slide.id} style={[styles.dot, i === index && styles.dotOn]} />
        ))}
      </View>
    </View>
  );
}

/** The four trust metrics from the site hero, as a dark band. */
export function TrustStrip() {
  const items = [
    { icon: 'timer-outline', metric: '10–15', label: 'Min to cook' },
    { icon: 'leaf-outline', metric: '100%', label: 'Farm fresh' },
    { icon: 'close-circle-outline', metric: '0%', label: 'Preservatives' },
    { icon: 'shield-checkmark-outline', metric: 'FSSAI', label: 'Certified' },
  ] as const;

  return (
    <View style={styles.trust}>
      {items.map((item, i) => (
        <View key={item.label} style={[styles.trustItem, i > 0 && styles.trustDivider]}>
          <Ionicons name={item.icon} size={15} color={colors.sprout} />
          <Text style={styles.trustMetric}>{item.metric}</Text>
          <Text style={styles.trustLabel}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

/** Category tile — artwork is a real pack shot from that category. */
export function CategoryTile({ category }: { category: Category }) {
  const router = useRouter();
  const sample = allProducts.find((p) => p.category === category.id);
  const count = allProducts.filter((p) => p.category === category.id).length;

  return (
    <Pressable
      onPress={() => router.push(`/category/${category.id}`)}
      accessibilityRole="button"
      accessibilityLabel={`${category.label}, ${count} pack${count === 1 ? '' : 's'}`}
      style={({ pressed }) => [styles.tile, pressed && { transform: [{ scale: 0.95 }] }]}
    >
      <View style={styles.tileRing}>
        {sample ? <Image source={sample.image} style={styles.tileImage} contentFit="cover" /> : null}
      </View>
      <Text style={styles.tileLabel} numberOfLines={1}>
        {category.label}
      </Text>
      <Text style={styles.tileCount}>{count} packs</Text>
    </Pressable>
  );
}

/** Tappable search affordance — navigates to the real search screen. */
export function SearchBar({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="search"
      accessibilityLabel="Search meal kits and chutneys"
      style={({ pressed }) => [styles.search, pressed && { opacity: 0.85 }]}
    >
      <Ionicons name="search" size={18} color={colors.leaf} />
      <Text style={styles.searchText}>Search meal kits, chutneys…</Text>
    </Pressable>
  );
}

/** A single "why Samachify" claim, drawn from the site's solution section. */
export function PromiseRow() {
  const items = [
    { icon: 'water-outline', label: 'No washing' },
    { icon: 'cut-outline', label: 'No cutting' },
    { icon: 'flash-outline', label: 'No guesswork' },
  ] as const;

  return (
    <View style={styles.promise}>
      {items.map((item) => (
        <View key={item.label} style={styles.promiseItem}>
          <Ionicons name={item.icon} size={16} color={colors.leaf} />
          <Text style={styles.promiseText}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  carousel: { paddingHorizontal: spacing.lg, gap: spacing.md },
  slide: {
    height: 196,
    borderRadius: radius.xl,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    backgroundColor: colors.forest,
  },
  slideBody: { padding: spacing.xl },
  slideEyebrow: { ...type.eyebrow, color: colors.sprout, marginBottom: spacing.sm },
  slideTitle: { ...type.display, color: colors.onDark, includeFontPadding: false },
  slideText: { ...type.small, color: colors.onDarkMuted, marginTop: spacing.sm, maxWidth: 260 },

  dots: { flexDirection: 'row', justifyContent: 'center', gap: 5, marginTop: spacing.md },
  dot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: colors.lineStrong },
  dotOn: { width: 20, backgroundColor: colors.leaf },

  trust: {
    flexDirection: 'row',
    backgroundColor: colors.bark,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    marginHorizontal: spacing.lg,
    ...shadow.card,
  },
  trustItem: { flex: 1, alignItems: 'center', gap: 3 },
  trustDivider: { borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.1)' },
  trustMetric: { ...type.h3, fontSize: 14, color: colors.onDark, includeFontPadding: false },
  trustLabel: { ...type.tiny, fontSize: 9.5, color: colors.onDarkMuted },

  tile: { width: 92, alignItems: 'center' },
  tileRing: {
    width: 78,
    height: 78,
    borderRadius: 39,
    overflow: 'hidden',
    backgroundColor: colors.wash,
    borderWidth: 2,
    borderColor: colors.paper,
    ...shadow.card,
  },
  tileImage: { width: '100%', height: '100%' },
  tileLabel: { ...type.smallStrong, color: colors.ink, marginTop: spacing.sm, textAlign: 'center' },
  tileCount: { ...type.tiny, fontSize: 10, color: colors.faint },

  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.paper,
    borderWidth: 1.5,
    borderColor: colors.lineStrong,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    height: 50,
    marginHorizontal: spacing.lg,
    ...shadow.card,
  },
  searchText: { ...type.bodyMed, color: colors.faint },

  promise: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  promiseItem: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
    paddingVertical: spacing.md,
    backgroundColor: colors.wash,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.lineStrong,
  },
  promiseText: { ...type.tiny, fontSize: 11, color: colors.moss },
});
