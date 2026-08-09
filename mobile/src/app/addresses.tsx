import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  IconTile,
  Screen,
  ScreenHeader,
  Skeleton,
} from '@/components/ui';
import {
  deleteAddress,
  formatAddressSubtitle,
  listAddresses,
  setDefaultAddress,
  type Address,
} from '@/lib/addresses';
import { useAuth } from '@/store/auth';
import { colors, radius, shadow, spacing, type } from '@/theme';

/** Saved addresses, shared with the website's address book. */
export default function Addresses() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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

  // Reload on focus so a save from the edit screen lands here immediately.
  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

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
          <Skeleton height={132} radius={radius.lg} />
          <Skeleton height={132} radius={radius.lg} />
        </View>
      </Screen>
    );
  }

  if (!user) {
    return (
      <Screen>
        <ScreenHeader title="My addresses" />
        <EmptyState
          icon="location-outline"
          title="Sign in to manage addresses"
          message="Saved addresses work across the app and samachify.in."
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

  const list = addresses ?? [];

  return (
    <Screen>
      <ScreenHeader
        title="My addresses"
        subtitle={list.length > 0 ? `${list.length} saved` : undefined}
      />

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 110 }]}
        showsVerticalScrollIndicator={false}
      >
        {list.length === 0 ? (
          <EmptyState
            icon="location-outline"
            title="No saved addresses"
            message="Add one and it'll be ready at checkout — here and on the website."
            actionLabel="Add an address"
            onAction={() => router.push('/address/edit')}
          />
        ) : (
          list.map((address) => (
            <Card key={address.id} style={styles.card} padded={false}>
              <View style={styles.cardTop}>
                <IconTile
                  name={
                    address.label === 'Work'
                      ? 'briefcase'
                      : address.label === 'Home'
                        ? 'home'
                        : 'location'
                  }
                  size={36}
                />

                <View style={styles.cardText}>
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>{address.label || 'Address'}</Text>
                    {address.is_default ? (
                      <Badge label="Default" tone="lime" icon="checkmark-circle" />
                    ) : null}
                  </View>
                  <Text style={styles.name}>{address.name}</Text>
                  <Text style={styles.line}>{formatAddressSubtitle(address)}</Text>
                  {address.phone ? <Text style={styles.line}>+91 {address.phone}</Text> : null}
                </View>
              </View>

              <View style={styles.actions}>
                {!address.is_default ? (
                  <Action
                    icon="star-outline"
                    label="Set default"
                    onPress={() => void makeDefault(address)}
                  />
                ) : null}
                <Action
                  icon="create-outline"
                  label="Edit"
                  onPress={() => router.push(`/address/edit?id=${address.id}`)}
                />
                <Action
                  icon="trash-outline"
                  label="Delete"
                  tone="danger"
                  onPress={() => confirmDelete(address)}
                />
              </View>
            </Card>
          ))
        )}
      </ScrollView>

      <View style={[styles.bar, { paddingBottom: insets.bottom + spacing.md }]}>
        <Button
          label="Add a new address"
          icon="add"
          size="lg"
          fullWidth
          onPress={() => router.push('/address/edit')}
        />
      </View>
    </Screen>
  );
}

function Action({
  icon,
  label,
  onPress,
  tone = 'default',
}: {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress: () => void;
  tone?: 'default' | 'danger';
}) {
  const color = tone === 'danger' ? colors.chilli : colors.leaf;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.action, pressed && { opacity: 0.55 }]}
    >
      <Ionicons name={icon} size={15} color={color} />
      <Text style={[styles.actionText, { color }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  loading: { padding: spacing.lg, gap: spacing.md },
  content: { padding: spacing.lg },

  card: { marginBottom: spacing.md, overflow: 'hidden' },
  cardTop: { flexDirection: 'row', gap: spacing.md, padding: spacing.lg },
  cardText: { flex: 1 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: 3 },
  label: { ...type.eyebrow, color: colors.muted },
  name: { ...type.bodyStrong, color: colors.ink },
  line: { ...type.small, color: colors.muted, marginTop: 2 },

  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.cream2,
  },
  action: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: spacing.md,
  },
  actionText: { ...type.tiny, fontSize: 11.5 },

  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    backgroundColor: colors.paper,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    ...shadow.lifted,
  },
});
