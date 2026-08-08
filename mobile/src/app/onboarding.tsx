import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui';
import { heroImages } from '@/data/products';
import { completeOnboarding } from '@/store/preferences';
import { colors, spacing } from '@/theme';

/**
 * Three screens, all copy lifted from the live website — the hero H1, the
 * "No Washing. No Cutting. No Guesswork." row, and the trust metrics. Nothing here
 * is a new marketing claim.
 */
const SLIDES = [
  {
    id: 'brand',
    eyebrow: "South India's First Fresh Ingredient Meal Kit",
    title: 'From Farm To Pan',
    body: 'Freshly sourced ingredients, pre-cut and pre-measured, delivered as ready-to-cook meal kits inspired by traditional South Indian recipes.',
    image: heroImages.all,
  },
  {
    id: 'convenience',
    eyebrow: 'No Washing. No Cutting.',
    title: 'No Guesswork.',
    body: 'Vegetables come from trusted farmers in Kanchipuram, cleaned and prepared under HACCP-compliant conditions, portioned for exactly one dish.',
    image: heroImages.sambar,
  },
  {
    id: 'speed',
    eyebrow: 'Ready in 10–15 minutes',
    title: 'Traditional South Indian cooking',
    body: 'Sambar, Kara Kuzhambu and fresh chutneys. 100% farm fresh, 0% preservatives, FSSAI certified.',
    image: heroImages.chutney,
  },
] as const;

export default function Onboarding() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);

  const finish = useCallback(async () => {
    await completeOnboarding();
    router.replace('/(tabs)');
  }, [router]);

  const next = () => {
    if (index >= SLIDES.length - 1) return void finish();
    const target = index + 1;
    scrollRef.current?.scrollTo({ x: target * width, animated: true });
    setIndex(target);
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / width);
    if (next !== index) setIndex(next);
  };

  const isLast = index === SLIDES.length - 1;

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        scrollEventThrottle={16}
      >
        {SLIDES.map((slide) => (
          <View key={slide.id} style={{ width }}>
            <Image source={slide.image} style={StyleSheet.absoluteFill} contentFit="cover" />
            <LinearGradient
              colors={['rgba(11,22,6,0.35)', 'rgba(11,22,6,0.92)', '#0b1606']}
              locations={[0, 0.55, 1]}
              style={StyleSheet.absoluteFill}
            />
            <View style={[styles.slideBody, { paddingBottom: insets.bottom + 190 }]}>
              <Text style={styles.eyebrow}>{slide.eyebrow}</Text>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.body}>{slide.body}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Skip is available on every slide — never trap someone in onboarding. */}
      <Pressable
        onPress={finish}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Skip onboarding"
        style={({ pressed }) => [styles.skip, { top: insets.top + spacing.md }, pressed && { opacity: 0.6 }]}
      >
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.xxl }]}>
        <View style={styles.dots}>
          {SLIDES.map((slide, i) => (
            <View key={slide.id} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>

        <Button
          label={isLast ? 'Get Started' : 'Next'}
          onPress={next}
          size="lg"
          fullWidth
          accessibilityHint={isLast ? 'Opens the Samachify home screen' : undefined}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.green950 },
  slideBody: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.xxl,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.lime,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 32,
    lineHeight: 38,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: -0.8,
  },
  body: {
    fontSize: 14.5,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.78)',
    marginTop: spacing.md,
  },
  skip: {
    position: 'absolute',
    right: spacing.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  skipText: { fontSize: 14, fontWeight: '700', color: colors.white },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.xxl,
  },
  dots: { flexDirection: 'row', gap: 6, marginBottom: spacing.xl },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.32)' },
  dotActive: { width: 22, backgroundColor: colors.lime },
});
