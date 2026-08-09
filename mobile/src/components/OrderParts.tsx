import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Badge, Divider } from '@/components/ui';
import { inr } from '@/lib/format';
import { STATUS_FLOW, STATUS_META, statusIndex, type OrderStatus } from '@/lib/orderStatus';
import { colors, radius, spacing, type } from '@/theme';

/** Status pill using the shared colour map, so app/web/admin all agree. */
export function StatusPill({ status }: { status: OrderStatus }) {
  const meta = STATUS_META[status];
  return <Badge label={meta.customer} tone="custom" color={meta.color} background={meta.bg} />;
}

/**
 * Vertical fulfilment timeline. Reads `order_status` only — the payment `status`
 * column is a different thing and must never drive this.
 */
export function OrderTimeline({ status }: { status: OrderStatus }) {
  if (status === 'cancelled') {
    const meta = STATUS_META.cancelled;
    return (
      <View style={[styles.cancelled, { backgroundColor: meta.bg }]}>
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
                  { backgroundColor: done ? meta.color : colors.line },
                  active && { borderWidth: 4, borderColor: meta.bg },
                ]}
              />
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
              <Text style={[styles.stageLabel, done ? styles.stageDone : styles.stagePending]}>
                {meta.customer}
              </Text>
              {active ? <Text style={styles.stageNow}>In progress</Text> : null}
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
        highlight={deliveryFee === 0}
      />
      <Divider style={{ marginVertical: spacing.md }} />
      <View style={styles.row}>
        <Text style={styles.totalLabel}>To pay</Text>
        <Text style={styles.totalValue}>{inr(total)}</Text>
      </View>
    </View>
  );
}

function Row({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, highlight && styles.rowValueFree]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cancelled: { padding: spacing.lg, borderRadius: radius.sm },
  cancelledText: { ...type.bodyStrong },

  stage: { flexDirection: 'row', gap: spacing.lg },
  rail: { alignItems: 'center', width: 20 },
  node: { width: 14, height: 14, borderRadius: 7, marginTop: 3 },
  connector: { width: 2, flex: 1, minHeight: 28 },
  stageBody: { flex: 1, paddingBottom: spacing.xl },
  stageLabel: { ...type.bodyStrong },
  stageDone: { color: colors.ink },
  stagePending: { color: colors.faint },
  stageNow: { ...type.small, color: colors.leaf, fontWeight: '700', marginTop: 2 },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  rowLabel: { ...type.body, color: colors.muted },
  rowValue: { ...type.bodyStrong, color: colors.ink },
  rowValueFree: { color: colors.success, fontWeight: '800' },
  totalLabel: { ...type.h3, color: colors.ink },
  totalValue: { ...type.h2, color: colors.ink },
});
