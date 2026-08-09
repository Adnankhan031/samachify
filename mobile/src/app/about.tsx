import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card, Divider, Eyebrow, IconTile, Screen, ScreenHeader, SectionHeader } from '@/components/ui';
import { heroImages } from '@/data/products';
import { colors, radius, spacing, type } from '@/theme';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

/**
 * Every word and image here is lifted from samachify.in/about — the founding
 * story, the four values, the leadership quotes and the roadmap phases. Nothing
 * about the company is invented in the app.
 */
const STORY =
  'Samachify was founded to bridge the gap between fresh farm produce and busy modern kitchens. We wanted to make home cooking simple without compromising on health, freshness, or taste.';

const VALUES: { icon: IoniconName; title: string; desc: string }[] = [
  { icon: 'shield-checkmark-outline', title: 'Food Safety First', desc: 'HACCP protocols at every production stage. No shortcuts.' },
  { icon: 'leaf-outline', title: 'Farm Direct', desc: 'Direct partnerships with Kanchipuram farmers. No middlemen.' },
  { icon: 'flash-outline', title: 'Radically Convenient', desc: 'Every product decision is made with your time in mind.' },
  { icon: 'heart-outline', title: 'Preserve Tradition', desc: 'We honour authentic recipes — no dumbed-down shortcuts.' },
];

const TEAM = [
  {
    name: 'Vikram T',
    role: 'Founder & CEO',
    badge: 'CEO',
    photo: require('../../assets/images/ceo.jpg'),
    quote:
      'Leading the vision to transform everyday cooking through innovative, farm-to-kitchen solutions — building a future where healthy home-cooked meals are convenient, accessible, and sustainable.',
  },
  {
    name: 'AsifAli I',
    role: 'Chief Operations Officer',
    badge: 'COO',
    photo: require('../../assets/images/coo.jpg'),
    quote:
      'Transforming vision into execution by managing operations, optimising processes, and building a reliable farm-to-kitchen ecosystem — dedicated to operational excellence and continuous improvement.',
  },
];

const ROADMAP = [
  { phase: 'Phase 1', title: 'Market Validation & Product Development', done: true },
  { phase: 'Phase 2', title: 'Pilot Launch & Customer Acquisition', done: false },
  { phase: 'Phase 3', title: 'Regional Expansion & Strategic Partnerships', done: false },
  { phase: 'Phase 4', title: 'National Scale-Up & Ecosystem Development', done: false },
];

const SOCIALS: { icon: IoniconName; label: string; url: string }[] = [
  { icon: 'logo-instagram', label: 'Instagram', url: 'https://www.instagram.com/samachify.in/' },
  { icon: 'logo-youtube', label: 'YouTube', url: 'https://www.youtube.com/@samachifydotin' },
  { icon: 'logo-linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/company/samachify-foods-pvt-ltd/' },
];

export default function About() {
  const insets = useSafeAreaInsets();

  const open = (url: string) => {
    void Linking.openURL(url).catch(() => {});
  };

  return (
    <Screen>
      <ScreenHeader title="About Samachify" borderless />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + spacing.section }}
      >
        <View style={styles.hero}>
          <Image source={heroImages.all} style={StyleSheet.absoluteFill} contentFit="cover" />
          <LinearGradient
            colors={['rgba(11,22,6,0.35)', 'rgba(11,22,6,0.92)']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroBody}>
            <Text style={styles.heroEyebrow}>South India&apos;s first</Text>
            <Text style={styles.heroTitle}>From Farm To Pan</Text>
            <Text style={styles.heroSub}>Fresh ingredient meal kits, made in Chennai.</Text>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.story}>{STORY}</Text>

          <Card tone="dark" style={styles.numbers}>
            {[
              ['4', 'Authentic dishes'],
              ['10–15', 'Minutes to cook'],
              ['0%', 'Preservatives'],
            ].map(([metric, label], i) => (
              <View key={label} style={[styles.number, i > 0 && styles.numberDivider]}>
                <Text style={styles.numberMetric}>{metric}</Text>
                <Text style={styles.numberLabel}>{label}</Text>
              </View>
            ))}
          </Card>

          <SectionHeader title="What we stand for" eyebrow="Our values" style={styles.head} />
          <Card padded={false}>
            {VALUES.map((value, i) => (
              <View key={value.title}>
                <View style={styles.value}>
                  <IconTile name={value.icon} size={38} />
                  <View style={styles.valueText}>
                    <Text style={styles.valueTitle}>{value.title}</Text>
                    <Text style={styles.valueDesc}>{value.desc}</Text>
                  </View>
                </View>
                {i < VALUES.length - 1 ? <Divider /> : null}
              </View>
            ))}
          </Card>

          <SectionHeader title="The people behind it" eyebrow="Leadership" style={styles.head} />
          {TEAM.map((person) => (
            <Card key={person.name} style={styles.person}>
              <View style={styles.personTop}>
                <Image source={person.photo} style={styles.photo} contentFit="cover" />
                <View style={styles.personText}>
                  <Text style={styles.personName}>{person.name}</Text>
                  <Text style={styles.personRole}>{person.role}</Text>
                  <View style={styles.personBadge}>
                    <Text style={styles.personBadgeText}>{person.badge}</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.quote}>&ldquo;{person.quote}&rdquo;</Text>
            </Card>
          ))}

          <SectionHeader title="Where we're going" eyebrow="Roadmap" style={styles.head} />
          <Card>
            {ROADMAP.map((step, i) => (
              <View key={step.phase} style={styles.step}>
                <View style={styles.stepRail}>
                  <View style={[styles.stepDot, step.done && styles.stepDotDone]}>
                    {step.done ? <Ionicons name="checkmark" size={11} color={colors.onDark} /> : null}
                  </View>
                  {i < ROADMAP.length - 1 ? <View style={styles.stepLine} /> : null}
                </View>
                <View style={styles.stepBody}>
                  <Text style={[styles.stepPhase, step.done && { color: colors.leaf }]}>
                    {step.phase}
                    {step.done ? ' · Complete' : ''}
                  </Text>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                </View>
              </View>
            ))}
          </Card>

          <Eyebrow style={styles.head}>Follow us</Eyebrow>
          <View style={styles.socials}>
            {SOCIALS.map((social) => (
              <Pressable
                key={social.label}
                onPress={() => open(social.url)}
                accessibilityRole="link"
                accessibilityLabel={social.label}
                style={({ pressed }) => [styles.social, pressed && { opacity: 0.7 }]}
              >
                <Ionicons name={social.icon} size={20} color={colors.leaf} />
                <Text style={styles.socialText}>{social.label}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.legal}>
            Samachify Foods Pvt Ltd{'\n'}FSSAI Licence 22426421000333
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    height: 210,
    marginHorizontal: spacing.lg,
    borderRadius: radius.xl,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    backgroundColor: colors.forest,
  },
  heroBody: { padding: spacing.xl },
  heroEyebrow: { ...type.eyebrow, color: colors.sprout, marginBottom: spacing.xs },
  heroTitle: { ...type.display, color: colors.onDark },
  heroSub: { ...type.small, color: colors.onDarkMuted, marginTop: 4 },

  body: { paddingHorizontal: spacing.lg, paddingTop: spacing.xxl },
  story: { ...type.body, color: colors.ink80, lineHeight: 24 },

  numbers: { flexDirection: 'row', marginTop: spacing.xxl, paddingVertical: spacing.lg },
  number: { flex: 1, alignItems: 'center' },
  numberDivider: { borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.1)' },
  numberMetric: { ...type.priceLg, fontSize: 20, lineHeight: 26, color: colors.sprout },
  numberLabel: { ...type.tiny, fontSize: 10, color: colors.onDarkMuted, marginTop: 2 },

  head: { marginTop: spacing.section },

  value: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  valueText: { flex: 1 },
  valueTitle: { ...type.h3, color: colors.ink },
  valueDesc: { ...type.tiny, color: colors.muted, marginTop: 2, lineHeight: 16 },

  person: { marginBottom: spacing.md },
  personTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  photo: { width: 68, height: 68, borderRadius: 34, backgroundColor: colors.wash },
  personText: { flex: 1 },
  personName: { ...type.serifMd, color: colors.ink },
  personRole: { ...type.tiny, color: colors.muted, marginTop: 1 },
  personBadge: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.wash,
  },
  personBadgeText: { ...type.tiny, fontSize: 10, color: colors.moss },
  quote: {
    ...type.small,
    color: colors.ink80,
    fontStyle: 'italic',
    lineHeight: 21,
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },

  step: { flexDirection: 'row', gap: spacing.md },
  stepRail: { alignItems: 'center', width: 20 },
  stepDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.lineStrong,
    marginTop: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotDone: { backgroundColor: colors.leaf, borderColor: colors.leaf },
  stepLine: { width: 2, flex: 1, backgroundColor: colors.line, marginVertical: 3 },
  stepBody: { flex: 1, paddingBottom: spacing.xl },
  stepPhase: { ...type.eyebrow, color: colors.faint },
  stepTitle: { ...type.smallStrong, color: colors.ink, marginTop: 3 },

  socials: { flexDirection: 'row', gap: spacing.md },
  social: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
    paddingVertical: spacing.lg,
    backgroundColor: colors.paper,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
  },
  socialText: { ...type.tiny, fontSize: 10.5, color: colors.moss },

  legal: {
    ...type.tiny,
    fontSize: 10.5,
    color: colors.faint,
    textAlign: 'center',
    marginTop: spacing.section,
    lineHeight: 17,
  },
});
