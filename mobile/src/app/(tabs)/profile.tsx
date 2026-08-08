import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, Card, Divider, Screen } from '@/components/ui';
import { SUPPORT_EMAIL, SUPPORT_PHONE } from '@/lib/config';
import { useAuth } from '@/store/auth';
import { colors, spacing, type } from '@/theme';

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
        <Text style={styles.title}>Profile</Text>

        {user ? (
          <Card style={styles.identity}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user.name.trim().charAt(0).toUpperCase() || 'S'}
              </Text>
            </View>
            <View style={styles.identityBody}>
              <Text style={styles.name} numberOfLines={1}>
                {user.name}
              </Text>
              <Text style={styles.email} numberOfLines={1}>
                {user.email}
              </Text>
              {user.phone ? <Text style={styles.email}>+91 {user.phone}</Text> : null}
            </View>
          </Card>
        ) : (
          <Card style={styles.signedOut}>
            <Text style={styles.signedOutTitle}>You&apos;re browsing as a guest</Text>
            <Text style={styles.signedOutBody}>
              Sign in to save addresses, see your orders and track deliveries. The same
              account works on samachify.in.
            </Text>
            <View style={styles.signedOutActions}>
              <Button label="Sign in" onPress={() => router.push('/login')} style={{ flex: 1 }} />
              <Button
                label="Create account"
                variant="secondary"
                onPress={() => router.push('/signup')}
                style={{ flex: 1 }}
              />
            </View>
          </Card>
        )}

        {user ? (
          <Card padded={false} style={styles.group}>
            <Row
              icon="receipt-outline"
              label="My orders"
              onPress={() => router.push('/(tabs)/orders')}
            />
            <Divider />
            <Row
              icon="location-outline"
              label="My addresses"
              onPress={() => router.push('/addresses')}
            />
          </Card>
        ) : null}

        <Text style={styles.groupLabel}>Support</Text>
        <Card padded={false} style={styles.group}>
          <Row
            icon="call-outline"
            label="Call us"
            value={SUPPORT_PHONE.replace('+91', '+91 ')}
            onPress={() => open(`tel:${SUPPORT_PHONE}`)}
          />
          <Divider />
          <Row
            icon="logo-whatsapp"
            label="WhatsApp"
            onPress={() => open(`https://wa.me/${SUPPORT_PHONE.replace('+', '')}`)}
          />
          <Divider />
          <Row icon="mail-outline" label="Email us" onPress={() => open(`mailto:${SUPPORT_EMAIL}`)} />
        </Card>

        <Text style={styles.groupLabel}>About Samachify</Text>
        <Card style={styles.about}>
          <Text style={styles.aboutTagline}>From Farm To Pan</Text>
          <Text style={styles.aboutBody}>
            South India&apos;s first fresh ingredient meal kit. Vegetables sourced directly
            from trusted farmers in Kanchipuram, cleaned and prepared under HACCP-compliant
            conditions, then delivered in Modified Atmosphere Packaging through an unbroken
            2–8°C cold chain.
          </Text>
          <Text style={styles.aboutMeta}>FSSAI Licence 22426421000333</Text>
        </Card>

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
            variant="secondary"
            onPress={confirmSignOut}
            fullWidth
            style={styles.signOut}
          />
        ) : null}

        <Text style={styles.version}>Samachify · v1.0.0</Text>
      </ScrollView>
    </Screen>
  );
}

function Row({
  icon,
  label,
  value,
  onPress,
}: {
  icon: IoniconName;
  label: string;
  value?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.cream2 }]}
    >
      <Ionicons name={icon} size={19} color={colors.green700} />
      <Text style={styles.rowLabel}>{label}</Text>
      {value ? <Text style={styles.rowValue}>{value}</Text> : null}
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.lg, paddingBottom: spacing.section, gap: spacing.md },
  title: { ...type.h1, color: colors.ink, marginBottom: spacing.sm },

  identity: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.green700,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 22, fontWeight: '800', color: colors.white },
  identityBody: { flex: 1 },
  name: { ...type.h2, color: colors.ink },
  email: { ...type.small, color: colors.muted, marginTop: 1 },

  signedOut: { gap: spacing.md },
  signedOutTitle: { ...type.h3, color: colors.ink },
  signedOutBody: { ...type.small, color: colors.muted, lineHeight: 19 },
  signedOutActions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xs },

  groupLabel: {
    ...type.caption,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: spacing.lg,
    marginLeft: spacing.xs,
  },
  group: { overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  rowLabel: { ...type.body, color: colors.ink, flex: 1 },
  rowValue: { ...type.small, color: colors.muted },
  chevron: { fontSize: 20, color: colors.mutedLight },

  about: { gap: spacing.sm },
  aboutTagline: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.green700,
  },
  aboutBody: { ...type.small, lineHeight: 20, color: colors.muted },
  aboutMeta: {
    ...type.caption,
    color: colors.mutedLight,
    marginTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: spacing.md,
  },

  signOut: { marginTop: spacing.lg },
  version: { ...type.caption, color: colors.mutedLight, textAlign: 'center', marginTop: spacing.lg },
});
