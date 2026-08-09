import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Badge, Divider } from '@/components/ui';
import { formatDateTime, inr } from '@/lib/format';
import { STATUS_FLOW, STATUS_META, statusIndex, type OrderStatus } from '@/lib/orderStatus';
import { colors, radius, spacing, type } from '@/theme';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

/** Status pill using the shared colour map, so app, web and admin agree. */
export function StatusPill({ status }: { status: OrderStatus }) {
  const meta = STATUS_META[status];
  return (
    <Badge
      label={meta.customer}
      tone="custom"
      color={meta.color}
      background={meta.bg}
      icon={meta.icon as IoniconName}
    />
  );
}

/**
 * Vertical fulfilment timeline. Reads `order_status` only — the payment `status`
 * column is a different thing and must never drive this.
 */
export function OrderTimeline({
  status,
  updatedAt,
}: {
  status: OrderStatus;
  updatedAt?: string | null;
}) {
  if (status === 'cancelled') {
    const meta = STATUS_META.cancelled;
    return (
      <View style={[styles.cancelled, { backgroundColor: meta.bg }]}>
        <Ionicons name="close-circle" size={18} color={meta.color} />
        <Text style={[styles.cancelledText, { color: meta.color }]}>
          This order was cancelled.
        </Text>
      </View>
    );
  }

  const current = statusIndex(status);

  return (
    <View>
      {STATUS_FLOW.map((stage, i) => {
        const meta = STATUS_META[stage];
        const done = i <= current;
        const active = i === current;
        const isLast = i === STATUS_FLOW.length - 1;

        return (
          <View key={stage} style={styles.stage}>
            <View style={styles.rail}>
              <View
                style={[
                  styles.node,
                  done ? { backgroundColor: meta.color } : styles.nodePending,
                  active && { borderWidth: 4, borderColor: meta.bg },
                ]}
              >
                {done && !active ? (
                  <Ionicons name="checkmark" size={11} color={colors.onDark} />
                ) : null}
              </View>
              {!isLast ? (
                <View
                  style={[
                    styles.connector,
                    { backgroundColor: i < current ? meta.color : colors.line },
                  ]}
                />
              ) : null}
            </View>

            <View style={styles.stageBody}>
              <Text style={[styles.stageLabel, done ? styles.done : styles.pending]}>
                {meta.customer}
              </Text>
              {active ? (
                <Text style={styles.stageNow}>
                  {updatedAt ? formatDateTime(updatedAt) : 'In progress'}
                </Text>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

/**
 * Subtotal / delivery / total. The same arithmetic the server uses, shown for
 * transparency — the server's numbers are the ones that count.
 */
export function PriceBreakdown({
  subtotal,
  deliveryFee,
  total,
}: {
  subtotal: number;
  deliveryFee: number;
  total: number;
}) {
  return (
    <View>
      <Row label="Item total" value={inr(subtotal)} />
      <Row
        label="Delivery fee"
        value={deliveryFee === 0 ? 'FREE' : inr(deliveryFee)}
        free={deliveryFee === 0}
      />
      <Divider style={{ marginVertical: spacing.md }} />
      <View style={styles.row}>
        <Text style={styles.totalLabel}>To pay</Text>
        <Text style={styles.totalValue}>{inr(total)}</Text>
      </View>
    </View>
  );
}

function Row({ label, value, free = false }: { label: string; value: string; free?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, free && styles.rowFree]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cancelled: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.md,
  },
  cancelledText: { ...type.bodyStrong },

  stage: { flexDirection: 'row', gap: spacing.lg },
  rail: { alignItems: 'center', width: 22 },
  node: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodePending: { backgroundColor: colors.paper, borderWidth: 2, borderColor: colors.line },
  connector: { width: 2, flex: 1, minHeight: 26 },
  stageBody: { flex: 1, paddingBottom: spacing.xl },
  stageLabel: { ...type.bodyStrong },
  done: { color: colors.ink },
  pending: { color: colors.faint },
  stageNow: { ...type.tiny, color: colors.leaf, marginTop: 2 },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  rowLabel: { ...type.small, color: colors.muted },
  rowValue: { ...type.priceSm, color: colors.ink },
  rowFree: { color: colors.success },
  totalLabel: { ...type.h3, color: colors.ink },
  totalValue: { ...type.priceLg, fontSize: 22, lineHeight: 27, color: colors.ink },
});
