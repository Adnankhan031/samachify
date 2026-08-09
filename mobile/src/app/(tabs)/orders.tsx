import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { StatusPill } from '@/components/OrderParts';
import { Card, EmptyState, ErrorState, Screen, Skeleton } from '@/components/ui';
import { formatDateTime, inr, orderRef, plural } from '@/lib/format';
import { listMyOrders, subscribeToOrders, type Order } from '@/lib/orders';
import { useAuth } from '@/store/auth';
import { colors, spacing, type } from '@/theme';

export default function Orders() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!user) {
      setOrders([]);
      return;
    }
    try {
      setError(null);
      setOrders(await listMyOrders());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load your orders.');
    }
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      void load();
    }, [load])
  );

  // The admin portal moves `order_status`; realtime keeps tracking honest without
  // the customer having to pull to refresh.
  useEffect(() => {
    if (!user) return;
    return subscribeToOrders(user.id, () => void load());
  }, [user, load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  if (authLoading) {
    return (
      <Screen>
        <Text style={styles.title}>Your orders</Text>
        <View style={styles.skeletons}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} height={104} radius={18} />
          ))}
        </View>
      </Screen>
    );
  }

  if (!user) {
    return (
      <Screen>
        <Text style={styles.title}>Your orders</Text>
        <EmptyState
          icon="cube-outline"
          title="Sign in to see your orders"
          message="Your order history and live tracking appear here once you're signed in."
          actionLabel="Sign in"
          onAction={() => router.push('/login')}
        />
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <Text style={styles.title}>Your orders</Text>
        <ErrorState message={error} onRetry={() => void load()} />
      </Screen>
    );
  }

  if (orders === null) {
    return (
      <Screen>
        <Text style={styles.title}>Your orders</Text>
        <View style={styles.skeletons}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} height={104} radius={18} />
          ))}
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.title}>Your orders</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.leaf} />
        }
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/order/${item.id}`)}
            accessibilityRole="button"
            accessibilityLabel={`Order ${orderRef(item.id)}, ${inr(item.total)}`}
            style={({ pressed }) => pressed && { opacity: 0.7 }}
          >
            <Card>
              <View style={styles.cardTop}>
                <Text style={styles.ref}>{orderRef(item.id)}</Text>
                <StatusPill status={item.orderStatus} />
              </View>

              <Text style={styles.date}>{formatDateTime(item.created_at)}</Text>

              <Text style={styles.items} numberOfLines={1}>
                {item.items.length > 0
                  ? item.items.map((i) => `${i.quantity}× ${i.product_name}`).join(', ')
                  : plural(0, 'item')}
              </Text>

              <View style={styles.cardBottom}>
                <Text style={styles.total}>{inr(item.total)}</Text>
                <Text style={styles.track}>Track order ›</Text>
              </View>
            </Card>
          </Pressable>
        )}
        ListEmptyComponent={
          <EmptyState
            icon="restaurant-outline"
            title="No orders yet"
            message="When you place your first Samachify order it'll show up here with live tracking."
            actionLabel="Browse packs"
            onAction={() => router.push('/(tabs)/categories')}
          />
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { ...type.h1, color: colors.ink, paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  skeletons: { padding: spacing.lg, gap: spacing.md },
  list: { padding: spacing.lg, paddingBottom: spacing.section },

  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  ref: { ...type.h3, color: colors.ink },
  date: { ...type.small, color: colors.muted },
  items: { ...type.small, color: colors.ink80, marginTop: spacing.sm },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  total: { ...type.h3, color: colors.ink },
  track: { ...type.small, fontWeight: '700', color: colors.leaf },
});
