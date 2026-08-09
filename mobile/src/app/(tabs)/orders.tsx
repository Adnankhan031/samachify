import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { StatusPill } from '@/components/OrderParts';
import {
  Card,
  Chip,
  EmptyState,
  ErrorState,
  IconTile,
  PageTitle,
  Screen,
  Skeleton,
} from '@/components/ui';
import { formatDateTime, inr, orderRef, plural } from '@/lib/format';
import { listMyOrders, subscribeToOrders, type Order } from '@/lib/orders';
import { STATUS_META } from '@/lib/orderStatus';
import { useAuth } from '@/store/auth';
import { colors, radius, spacing, type } from '@/theme';

type Tab = 'active' | 'delivered' | 'all';

const TABS: { key: Tab; label: string }[] = [
  { key: 'active', label: 'Active' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'all', label: 'All' },
];

export default function Orders() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<Tab>('active');

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

  // The admin portal moves `order_status`; realtime keeps tracking honest
  // without the customer pulling to refresh.
  useEffect(() => {
    if (!user) return;
    return subscribeToOrders(user.id, () => void load());
  }, [user, load]);

  const visible = useMemo(() => {
    if (!orders) return [];
    if (tab === 'all') return orders;
    if (tab === 'delivered') return orders.filter((o) => o.orderStatus === 'delivered');
    return orders.filter((o) => !['delivered', 'cancelled'].includes(o.orderStatus));
  }, [orders, tab]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const skeletons = (
    <View style={styles.skeletons}>
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} height={128} radius={radius.lg} />
      ))}
    </View>
  );

  if (authLoading) {
    return (
      <Screen>
        <PageTitle title="Your orders" />
        {skeletons}
      </Screen>
    );
  }

  if (!user) {
    return (
      <Screen>
        <PageTitle title="Your orders" />
        <EmptyState
          icon="receipt-outline"
          title="Sign in to see your orders"
          message="Order history and live tracking appear here once you're signed in."
          actionLabel="Sign in"
          onAction={() => router.push('/login')}
          secondaryLabel="Create an account"
          onSecondary={() => router.push('/signup')}
        />
      </Screen>
    );
  }

  if (error) {
    return (
      <Screen>
        <PageTitle title="Your orders" />
        <ErrorState message={error} onRetry={() => void load()} />
      </Screen>
    );
  }

  if (orders === null) {
    return (
      <Screen>
        <PageTitle title="Your orders" />
        {skeletons}
      </Screen>
    );
  }

  return (
    <Screen>
      <PageTitle
        title="Your orders"
        subtitle={orders.length > 0 ? plural(orders.length, 'order') : undefined}
      />

      {orders.length > 0 ? (
        <View style={styles.tabs}>
          {TABS.map((t) => (
            <Chip key={t.key} label={t.label} active={tab === t.key} onPress={() => setTab(t.key)} />
          ))}
        </View>
      ) : null}

      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.leaf} />
        }
        ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
        renderItem={({ item }) => {
          const meta = STATUS_META[item.orderStatus];
          return (
            <Pressable
              onPress={() => router.push(`/order/${item.id}`)}
              accessibilityRole="button"
              accessibilityLabel={`Order ${orderRef(item.id)}, ${inr(item.total)}, ${meta.customer}`}
              style={({ pressed }) => pressed && { opacity: 0.75 }}
            >
              <Card padded={false} style={styles.card}>
                <View style={styles.cardTop}>
                  <IconTile
                    name={meta.icon as React.ComponentProps<typeof Ionicons>['name']}
                    size={40}
                    tone={item.orderStatus === 'cancelled' ? 'danger' : 'leaf'}
                  />
                  <View style={styles.cardText}>
                    <Text style={styles.ref}>{orderRef(item.id)}</Text>
                    <Text style={styles.date}>{formatDateTime(item.created_at)}</Text>
                  </View>
                  <StatusPill status={item.orderStatus} />
                </View>

                <Text style={styles.items} numberOfLines={2}>
                  {item.items.length > 0
                    ? item.items.map((i) => `${i.quantity} × ${i.product_name}`).join(' · ')
                    : 'No items recorded'}
                </Text>

                <View style={styles.cardBottom}>
                  <View>
                    <Text style={styles.totalLabel}>
                      {item.payment_method === 'cod' ? 'Cash on delivery' : 'Paid online'}
                    </Text>
                    <Text style={styles.total}>{inr(item.total)}</Text>
                  </View>
                  <View style={styles.track}>
                    <Text style={styles.trackText}>Track</Text>
                    <Ionicons name="chevron-forward" size={13} color={colors.leaf} />
                  </View>
                </View>
              </Card>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          orders.length === 0 ? (
            <EmptyState
              icon="restaurant-outline"
              title="No orders yet"
              message="Your first Samachify order will show up here with live tracking."
              actionLabel="Browse packs"
              onAction={() => router.push('/(tabs)/categories')}
            />
          ) : (
            <EmptyState
              icon="filter-outline"
              title={tab === 'active' ? 'Nothing in progress' : 'Nothing delivered yet'}
              message="Switch tabs to see your other orders."
              actionLabel="Show all orders"
              onAction={() => setTab('all')}
            />
          )
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  skeletons: { padding: spacing.lg, gap: spacing.md },
  tabs: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  list: { padding: spacing.lg, paddingTop: spacing.xs, paddingBottom: spacing.section },

  card: { padding: spacing.lg },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  cardText: { flex: 1 },
  ref: { ...type.h3, color: colors.ink },
  date: { ...type.tiny, color: colors.muted, marginTop: 1 },

  items: {
    ...type.small,
    color: colors.ink80,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },

  cardBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  totalLabel: { ...type.tiny, fontSize: 10.5, color: colors.faint },
  total: { ...type.price, color: colors.ink },
  track: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  trackText: { ...type.smallStrong, color: colors.leaf },
});
