import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Badge, Button, Card, EmptyState, ErrorState, Screen, ScreenHeader, Skeleton } from '@/components/ui';
import {
  deleteAddress,
  formatAddressSubtitle,
  listAddresses,
  setDefaultAddress,
  type Address,
} from '@/lib/addresses';
import { useAuth } from '@/store/auth';
import { colors, spacing, type } from '@/theme';

/**
 * Read/manage the saved addresses shared with the website. Creating an address
 * happens inside checkout, where it's actually needed — a standalone "add address"
 * form here would be a second code path for the same fields.
 */
export default function Addresses() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      setError(null);
      setAddresses(await listAddresses());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load your addresses.');
    }
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  const confirmDelete = (address: Address) => {
    Alert.alert('Delete this address?', formatAddressSubtitle(address), [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteAddress(address.id);
            await load();
          } catch (e) {
            Alert.alert('Could not delete', e instanceof Error ? e.message : 'Please try again.');
          }
        },
      },
    ]);
  };

  const makeDefault = async (address: Address) => {
    try {
      await setDefaultAddress(address.id);
      await load();
    } catch (e) {
      Alert.alert('Could not update', e instanceof Error ? e.message : 'Please try again.');
    }
  };

  if (authLoading || (user && addresses === null && !error)) {
    return (
      <Screen>
        <ScreenHeader title="My addresses" />
        <View style={styles.loading}>
          <Skeleton height={104} radius={18} />
          <Skeleton height={104} radius={18} />
        </View>
      </Screen>
    );
  }

  if (!user) {
    return (
      <Screen>
        <ScreenHeader title="My addresses" />
        <EmptyState
          emoji="📍"
          title="Sign in to manage addresses"
          message="Saved addresses are shared with samachify.in."
          actionLabel="Sign in"
          onAction={() => router.push('/login')}
        />
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <ScreenHeader title="My addresses" />
        <ErrorState message={error} onRetry={() => void load()} />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader title="My addresses" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {addresses && addresses.length === 0 ? (
          <EmptyState
            emoji="📍"
            title="No saved addresses"
            message="Addresses you enter at checkout are saved here for next time."
            actionLabel="Browse packs"
            onAction={() => router.push('/(tabs)/categories')}
          />
        ) : (
          (addresses ?? []).map((address) => (
            <Card key={address.id} style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.label}>{address.label || 'Address'}</Text>
                {address.is_default ? <Badge label="Default" tone="lime" /> : null}
              </View>

              <Text style={styles.name}>{address.name}</Text>
              <Text style={styles.line}>{formatAddressSubtitle(address)}</Text>
              {address.phone ? <Text style={styles.line}>+91 {address.phone}</Text> : null}

              <View style={styles.actions}>
                {!address.is_default ? (
                  <Pressable
                    onPress={() => void makeDefault(address)}
                    hitSlop={8}
                    accessibilityRole="button"
                    style={({ pressed }) => pressed && { opacity: 0.6 }}
                  >
                    <Text style={styles.action}>Set as default</Text>
                  </Pressable>
                ) : null}
                <Pressable
                  onPress={() => confirmDelete(address)}
                  hitSlop={8}
                  accessibilityRole="button"
                  style={({ pressed }) => pressed && { opacity: 0.6 }}
                >
                  <Text style={[styles.action, styles.destructive]}>Delete</Text>
                </Pressable>
              </View>
            </Card>
          ))
        )}

        {addresses && addresses.length > 0 ? (
          <Text style={styles.hint}>
            New addresses are saved when you enter them at checkout.
          </Text>
        ) : null}

        <Button
          label="Back to profile"
          variant="secondary"
          fullWidth
          onPress={() => router.back()}
          style={styles.back}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: { padding: spacing.lg, gap: spacing.md },
  content: { padding: spacing.lg },
  card: { marginBottom: spacing.md },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { ...type.caption, color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.8 },
  name: { ...type.bodyStrong, color: colors.ink, marginTop: spacing.sm },
  line: { ...type.small, color: colors.muted, marginTop: 2 },
  actions: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  action: { ...type.small, fontWeight: '700', color: colors.green700 },
  destructive: { color: colors.danger },
  hint: { ...type.small, color: colors.mutedLight, textAlign: 'center', marginTop: spacing.md },
  back: { marginTop: spacing.xxl },
});
