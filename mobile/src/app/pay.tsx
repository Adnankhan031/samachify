import { useRouter } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

import { Button, Card, Screen, ScreenHeader } from '@/components/ui';
import { ApiError, NetworkError, verifyRazorpayPayment } from '@/lib/api';
import { inr } from '@/lib/format';
import {
  buildCheckoutHtml,
  clearPendingPayment,
  parseCheckoutMessage,
  takePendingPayment,
} from '@/lib/payment';
import { useCart } from '@/store/cart';
import { colors, spacing, type } from '@/theme';

type Phase = 'paying' | 'verifying' | 'cancelled' | 'failed';

/**
 * Razorpay checkout in a WebView.
 *
 * The app relays what Razorpay returns; it never concludes that a payment
 * succeeded. `/api/razorpay/verify` recomputes the HMAC against the key secret
 * and only writes the order if the signature holds — so a tampered WebView
 * message buys nothing.
 */
export default function Pay() {
  const router = useRouter();
  const { clearCart } = useCart();

  // Read once: the payment screen owns the intent for its lifetime, and
  // re-reading module state on every render would fight React's model.
  const payment = useRef(takePendingPayment()).current;

  const [phase, setPhase] = useState<Phase>('paying');
  const [error, setError] = useState<string | null>(null);
  const settled = useRef(false);

  const onMessage = useCallback(
    async (event: WebViewMessageEvent) => {
      const message = parseCheckoutMessage(event.nativeEvent.data);
      if (!message || !payment) return;

      // Razorpay can emit both `payment.failed` and a dismissal for one attempt.
      // Whichever lands first decides the outcome.
      if (settled.current) return;

      if (message.type === 'dismissed') {
        settled.current = true;
        setPhase('cancelled');
        return;
      }

      if (message.type === 'failed') {
        settled.current = true;
        setError(message.message);
        setPhase('failed');
        return;
      }

      settled.current = true;
      setPhase('verifying');

      try {
        const result = await verifyRazorpayPayment({
          ...message.response,
          customer: payment.customer,
          items: payment.items,
        });
        clearPendingPayment();
        clearCart();
        router.replace(`/order/${result.orderId}?placed=1`);
      } catch (e) {
        // Money may well have left the customer's account here, so the copy has
        // to be honest that this is a recording failure, not a payment failure.
        setError(
          e instanceof NetworkError || e instanceof ApiError
            ? e.message
            : 'We could not confirm your payment.'
        );
        setPhase('failed');
      }
    },
    [payment, router, clearCart]
  );

  if (!payment) {
    return (
      <Screen>
        <ScreenHeader title="Payment" />
        <View style={styles.centre}>
          <Text style={styles.title}>Nothing to pay for</Text>
          <Text style={styles.body}>This payment session has expired. Start checkout again.</Text>
          <Button
            label="Back to cart"
            onPress={() => router.replace('/(tabs)/cart')}
            style={styles.action}
          />
        </View>
      </Screen>
    );
  }

  if (phase === 'verifying') {
    return (
      <Screen>
        <ScreenHeader title="Confirming payment" />
        <View style={styles.centre}>
          <ActivityIndicator size="large" color={colors.leaf} />
          <Text style={styles.title}>Confirming your payment</Text>
          <Text style={styles.body}>
            Don&apos;t close the app — we&apos;re recording your order.
          </Text>
        </View>
      </Screen>
    );
  }

  if (phase === 'cancelled' || phase === 'failed') {
    const cancelled = phase === 'cancelled';
    return (
      <Screen>
        <ScreenHeader title="Payment" onBack={() => router.replace('/checkout')} />
        <View style={styles.centre}>
          <Card style={styles.card}>
            <Text style={styles.title}>
              {cancelled ? 'Payment cancelled' : "Payment didn't go through"}
            </Text>
            <Text style={styles.body}>
              {cancelled
                ? 'Nothing was charged. Your cart is still here.'
                : (error ?? 'Something went wrong during payment.')}
            </Text>
            {!cancelled ? (
              <Text style={styles.note}>
                If money left your account, it will be refunded automatically. Contact us with
                your phone number and we&apos;ll check.
              </Text>
            ) : null}
          </Card>

          <Button
            label="Try again"
            icon="refresh"
            fullWidth
            onPress={() => router.replace('/checkout')}
            style={styles.action}
          />
          <Button
            label="Pay cash on delivery instead"
            variant="ghost"
            fullWidth
            onPress={() => router.replace('/checkout')}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader
        title="Secure payment"
        subtitle={inr(payment.intent.total)}
        onBack={() => router.replace('/checkout')}
      />
      <WebView
        originWhitelist={['*']}
        source={{ html: buildCheckoutHtml(payment), baseUrl: 'https://samachify.in' }}
        onMessage={onMessage}
        javaScriptEnabled
        domStorageEnabled
        startInLoadingState
        setSupportMultipleWindows={false}
        renderLoading={() => (
          <View style={styles.centre}>
            <ActivityIndicator size="large" color={colors.leaf} />
          </View>
        )}
        style={styles.web}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  web: { flex: 1, backgroundColor: colors.cream },
  centre: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    gap: spacing.md,
  },
  card: { alignSelf: 'stretch', gap: spacing.sm },
  title: { ...type.serifLg, color: colors.ink, textAlign: 'center' },
  body: { ...type.small, color: colors.muted, textAlign: 'center' },
  note: {
    ...type.tiny,
    color: colors.faint,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: 17,
  },
  action: { marginTop: spacing.lg, alignSelf: 'stretch' },
});
