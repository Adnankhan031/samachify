import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, Card, Divider, Eyebrow, IconTile, Screen } from '@/components/ui';
import { SUPPORT_EMAIL, SUPPORT_PHONE } from '@/lib/config';
import { useAuth } from '@/store/auth';
import { colors, radius, shadow, spacing, type } from '@/theme';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

export default function Profile() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const confirmSignOut = () => {
    Alert.alert('Sign out?', 'Your cart stays on this device.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => void signOut() },
    ]);
  };

  const open = (url: string) => {
    void Linking.openURL(url).catch(() => {
      Alert.alert('Could not open', 'No app on this device can handle that link.');
    });
  };

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Dark identity band, matching Home's header treatment. */}
        <View style={styles.hero}>
          {user ? (
            <View style={styles.identity}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user.name.trim().charAt(0).toUpperCase() || 'S'}
                </Text>
              </View>
              <View style={styles.identityText}>
                <Text style={styles.name} numberOfLines={1}>
                  {user.name}
                </Text>
                <Text style={styles.email} numberOfLines={1}>
                  {user.email}
                </Text>
                {user.phone ? <Text style={styles.email}>+91 {user.phone}</Text> : null}
              </View>
            </View>
          ) : (
            <View>
              <Text style={styles.guestTitle}>You&apos;re browsing as a guest</Text>
              <Text style={styles.guestBody}>
                Sign in to save addresses, track deliveries and see your orders. The same
                account works on samachify.in.
              </Text>
              <View style={styles.guestActions}>
                <Button
                  label="Sign in"
                  variant="onDark"
                  onPress={() => router.push('/login')}
                  style={{ flex: 1 }}
                />
                <Button
                  label="Create account"
                  variant="ghost"
                  onPress={() => router.push('/signup')}
                  style={[{ flex: 1 }, styles.ghostOnDark]}
                />
              </View>
            </View>
          )}
        </View>

        <View style={styles.body}>
          {user ? (
            <>
              <Eyebrow style={styles.groupLabel}>Your account</Eyebrow>
              <Card padded={false} style={styles.group}>
                <Row
                  icon="receipt-outline"
                  label="My orders"
                  hint="Track and reorder"
                  onPress={() => router.push('/(tabs)/orders')}
                />
                <Divider />
                <Row
                  icon="location-outline"
                  label="My addresses"
                  hint="Saved delivery locations"
                  onPress={() => router.push('/addresses')}
                />
              </Card>
            </>
          ) : null}

          <Eyebrow style={styles.groupLabel}>Support</Eyebrow>
          <Card padded={false} style={styles.group}>
            <Row
              icon="call-outline"
              label="Call us"
              hint={SUPPORT_PHONE.replace('+91', '+91 ')}
              onPress={() => open(`tel:${SUPPORT_PHONE}`)}
            />
            <Divider />
            <Row
              icon="logo-whatsapp"
              label="WhatsApp"
              hint="Fastest reply"
              onPress={() => open(`https://wa.me/${SUPPORT_PHONE.replace('+', '')}`)}
            />
            <Divider />
            <Row
              icon="mail-outline"
              label="Email us"
              hint={SUPPORT_EMAIL}
              onPress={() => open(`mailto:${SUPPORT_EMAIL}`)}
            />
          </Card>

          <Eyebrow style={styles.groupLabel}>Samachify</Eyebrow>
          <Pressable
            onPress={() => router.push('/about')}
            accessibilityRole="button"
            accessibilityLabel="About Samachify — our story, values, team and roadmap"
            style={({ pressed }) => [pressed && { opacity: 0.8 }]}
          >
            <Card tone="dark" style={styles.about}>
              <View style={styles.aboutRow}>
                <View style={styles.flex}>
                  <Text style={styles.aboutTagline}>From Farm To Pan</Text>
                  <Text style={styles.aboutBody}>
                    Our story, what we stand for, the people behind Samachify, and where
                    we&apos;re going next.
                  </Text>
                </View>
                <Ionicons name="arrow-forward" size={18} color={colors.sprout} />
              </View>
            </Card>
          </Pressable>

          <Eyebrow style={styles.groupLabel}>Legal</Eyebrow>
          <Card padded={false} style={styles.group}>
            <Row
              icon="document-text-outline"
              label="Terms & Conditions"
              onPress={() => open('https://samachify.in/legal/terms')}
            />
            <Divider />
            <Row
              icon="shield-checkmark-outline"
              label="Privacy Policy"
              onPress={() => open('https://samachify.in/legal/privacy')}
            />
            <Divider />
            <Row
              icon="refresh-outline"
              label="Refund & Cancellation"
              onPress={() => open('https://samachify.in/legal/refunds')}
            />
            <Divider />
            <Row
              icon="cube-outline"
              label="Shipping & Delivery"
              onPress={() => open('https://samachify.in/legal/shipping')}
            />
          </Card>

          {user ? (
            <Button
              label="Sign out"
              icon="log-out-outline"
              variant="secondary"
              onPress={confirmSignOut}
              fullWidth
              style={styles.signOut}
            />
          ) : null}

          <Text style={styles.version}>Samachify · v1.0.0</Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

function Row({
  icon,
  label,
  hint,
  onPress,
}: {
  icon: IoniconName;
  label: string;
  hint?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={hint}
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.cream2 }]}
    >
      <IconTile name={icon} size={36} />
      <View style={styles.rowText}>
        <Text style={styles.rowLabel}>{label}</Text>
        {hint ? (
          <Text style={styles.rowHint} numberOfLines={1}>
            {hint}
          </Text>
        ) : null}
      </View>
      <Ionicons name="chevron-forward" size={17} color={colors.faint} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: spacing.section },

  hero: {
    backgroundColor: colors.bark,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  identity: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.sprout,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { ...type.display, fontSize: 25, color: colors.bark, includeFontPadding: false },
  identityText: { flex: 1 },
  name: { ...type.serifLg, color: colors.onDark },
  email: { ...type.tiny, color: colors.onDarkMuted, marginTop: 1 },

  guestTitle: { ...type.serifLg, color: colors.onDark },
  guestBody: { ...type.small, color: colors.onDarkMuted, marginTop: spacing.sm, lineHeight: 20 },
  guestActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl },
  ghostOnDark: { borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.25)' },

  body: { paddingHorizontal: spacing.lg, marginTop: spacing.xxl },
  groupLabel: { color: colors.muted, marginBottom: spacing.md, marginLeft: spacing.xs },
  group: { overflow: 'hidden', marginBottom: spacing.xxl },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  rowText: { flex: 1 },
  rowLabel: { ...type.bodyStrong, color: colors.ink },
  rowHint: { ...type.tiny, color: colors.muted, marginTop: 1 },

  about: { marginBottom: spacing.xxl },
  aboutRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  flex: { flex: 1 },
  aboutTagline: { ...type.eyebrow, color: colors.sprout, marginBottom: spacing.sm },
  aboutBody: { ...type.small, lineHeight: 20, color: colors.onDarkMuted },

  signOut: { marginBottom: spacing.lg },
  version: { ...type.tiny, fontSize: 10.5, color: colors.faint, textAlign: 'center' },
});
