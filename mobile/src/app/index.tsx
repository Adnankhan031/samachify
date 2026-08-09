import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { hasCompletedOnboarding } from '@/store/preferences';
import { colors, spacing } from '@/theme';

/**
 * Start-up gate. Decides where the app opens, then hands off.
 *
 *   first launch  → onboarding
 *   afterwards    → home
 *
 * Auth is *not* checked here on purpose: a customer can browse the catalogue and
 * build a cart signed out, exactly like the website. Sign-in is required only at
 * checkout, which is where `/checkout` sends them.
 */
export default function StartupGate() {
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const seenOnboarding = await hasCompletedOnboarding();
      if (cancelled) return;

      router.replace(seenOnboarding ? '/(tabs)' : '/onboarding');
      // Hide only after the destination is mounted, so there is no cream flash
      // between the splash image and the first real screen.
      await SplashScreen.hideAsync().catch(() => {});
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  // Mirrors the native splash so the handover is invisible.
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/logo-square.png')}
        style={styles.logo}
        contentFit="contain"
      />
      <Text style={styles.tagline}>From Farm To Pan</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cream,
  },
  logo: { width: 160, height: 160 },
  tagline: {
    marginTop: spacing.lg,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    color: colors.leaf,
  },
});
