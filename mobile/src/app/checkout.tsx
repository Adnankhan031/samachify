import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PriceBreakdown } from '@/components/OrderParts';
import {
  Button,
  Card,
  Chip,
  EmptyState,
  ErrorBanner,
  Input,
  Screen,
  ScreenHeader,
  SectionHeader,
  Skeleton,
} from '@/components/ui';
import { formatAddressSubtitle, listAddresses, type Address } from '@/lib/addresses';
import { ApiError, NetworkError, placeCodOrder } from '@/lib/api';
import { inr } from '@/lib/format';
import { useAuth } from '@/store/auth';
import { useCart } from '@/store/cart';
import { colors, shadow, spacing, type } from '@/theme';

interface FormState {
  name: string;
  email: string;
  phone: string;
  houseNo: string;
  area: string;
  landmark: string;
  city: string;
  pincode: string;
}

const EMPTY_FORM: FormState = {
  name: '',
  email: '',
  phone: '',
  houseNo: '',
  area: '',
  landmark: '',
  city: '',
  pincode: '',
};

export default function Checkout() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, loading: authLoading } = useAuth();
  const { items, subtotal, deliveryFee, total, clearCart } = useCart();

  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);

  // Checkout needs an account so the order lands in order history and can be
  // tracked. Same rule as the website.
  useEffect(() => {
    if (!authLoading && !user) router.replace('/login?next=checkout');
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    setForm((f) => ({ ...f, name: f.name || user.name, email: f.email || user.email, phone: f.phone || user.phone }));

    listAddresses()
      .then((list) => {
        setAddresses(list);
        const preferred = list.find((a) => a.is_default) ?? list[0];
        if (preferred) applyAddress(preferred);
      })
      .catch(() => setAddresses([]));
    // applyAddress is stable for this effect's purposes; only `user` should re-run it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const applyAddress = useCallback((a: Address) => {
    setSelectedId(a.id);
    setForm((f) => ({
      ...f,
      name: a.name || f.name,
      phone: a.phone || f.phone,
      houseNo: a.house_no,
      area: a.area,
      landmark: a.landmark,
      city: a.city,
      pincode: a.pincode,
    }));
    setErrors({});
  }, []);

  const useNewAddress = () => {
    setSelectedId(null);
    setForm((f) => ({ ...f, houseNo: '', area: '', landmark: '', city: '', pincode: '' }));
  };

  const set = (field: keyof FormState) => (value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  /** Mirrors the server's `validateCustomer` so we fail before a round trip. */
  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};

    if (!form.name.trim()) next.name = 'Enter your name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email';
    if (!/^[0-9]{10}$/.test(form.phone.replace(/\D/g, ''))) next.phone = 'Enter a 10-digit mobile number';
    if (!form.houseNo.trim()) next.houseNo = 'Enter your house or flat number';
    if (!form.area.trim()) next.area = 'Enter your area or street';
    if (!form.city.trim()) next.city = 'Enter your city';
    if (!/^[0-9]{6}$/.test(form.pincode)) next.pincode = 'Enter a 6-digit pincode';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const placeOrder = async () => {
    if (!validate()) return;

    setPlacing(true);
    setSubmitError(null);

    try {
      const order = await placeCodOrder(
        {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.replace(/\D/g, ''),
          address: [form.houseNo, form.area, form.landmark].filter(Boolean).join(', '),
          city: form.city.trim(),
          pincode: form.pincode,
        },
        items.map((i) => ({ productId: i.productId, quantity: i.quantity }))
      );

      clearCart();
      router.replace(`/order/${order.orderId}?placed=1`);
    } catch (e) {
      if (e instanceof NetworkError) setSubmitError(e.message);
      else if (e instanceof ApiError) setSubmitError(e.message);
      else setSubmitError('Could not place your order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (authLoading || !user) {
    return (
      <Screen>
        <ScreenHeader title="Checkout" />
        <View style={styles.loading}>
          <Skeleton height={90} radius={18} />
          <Skeleton height={220} radius={18} />
        </View>
      </Screen>
    );
  }

  if (items.length === 0) {
    return (
      <Screen>
        <ScreenHeader title="Checkout" />
        <EmptyState
          emoji="🛒"
          title="Nothing to check out"
          message="Your cart is empty."
          actionLabel="Browse packs"
          onAction={() => router.replace('/(tabs)/categories')}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader title="Checkout" subtitle={`${items.length} pack${items.length === 1 ? '' : 's'}`} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 140 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {addresses === null ? (
            <Skeleton height={72} radius={18} />
          ) : addresses.length > 0 ? (
            <View>
              <SectionHeader title="Deliver to" />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
                {addresses.map((a) => (
                  <Chip
                    key={a.id}
                    label={a.label || 'Saved'}
                    active={selectedId === a.id}
                    onPress={() => applyAddress(a)}
                  />
                ))}
                <Chip label="+ New address" active={selectedId === null} onPress={useNewAddress} />
              </ScrollView>
              {selectedId ? (
                <Text style={styles.selectedLine}>
                  {formatAddressSubtitle(addresses.find((a) => a.id === selectedId)!)}
                </Text>
              ) : null}
            </View>
          ) : null}

          <View style={styles.section}>
            <SectionHeader title="Contact" />
            <Input label="Full name" value={form.name} onChangeText={set('name')} autoCapitalize="words" error={errors.name} />
            <Input
              label="Email"
              value={form.email}
              onChangeText={set('email')}
              keyboardType="email-address"
              error={errors.email}
            />
            <Input
              label="Mobile number"
              value={form.phone}
              onChangeText={(v) => set('phone')(v.replace(/\D/g, ''))}
              keyboardType="number-pad"
              maxLength={10}
              error={errors.phone}
            />
          </View>

          <View style={styles.section}>
            <SectionHeader title="Delivery address" />
            <Input label="House / flat number" value={form.houseNo} onChangeText={set('houseNo')} autoCapitalize="words" error={errors.houseNo} />
            <Input label="Area / street" value={form.area} onChangeText={set('area')} autoCapitalize="words" error={errors.area} />
            <Input label="Landmark" value={form.landmark} onChangeText={set('landmark')} autoCapitalize="words" hint="Optional" />
            <Input label="City" value={form.city} onChangeText={set('city')} autoCapitalize="words" error={errors.city} />
            <Input
              label="Pincode"
              value={form.pincode}
              onChangeText={(v) => set('pincode')(v.replace(/\D/g, ''))}
              keyboardType="number-pad"
              maxLength={6}
              error={errors.pincode}
            />
          </View>

          <View style={styles.section}>
            <SectionHeader title="Payment" />
            <Pressable disabled accessibilityRole="radio" accessibilityState={{ selected: true }}>
              <Card style={styles.payMethod}>
                <View style={styles.radio}>
                  <View style={styles.radioDot} />
                </View>
                <View style={styles.flex}>
                  <Text style={styles.payTitle}>Cash on Delivery</Text>
                  <Text style={styles.payBody}>Pay the delivery partner when your pack arrives.</Text>
                </View>
              </Card>
            </Pressable>
            {/* Online payment needs the native Razorpay module, which requires a
                development build. Stated plainly rather than shown as a dead option. */}
            <Text style={styles.payNote}>
              Online payment (UPI / card) is available on samachify.in and is coming to
              the app shortly.
            </Text>
          </View>

          <Card style={styles.section}>
            <Text style={styles.summaryTitle}>Bill details</Text>
            <PriceBreakdown subtotal={subtotal} deliveryFee={deliveryFee} total={total} />
          </Card>

          {submitError ? <ErrorBanner message={submitError} /> : null}

          <Text style={styles.disclaimer}>
            Samachify confirms the final amount when the order is created.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={[styles.bar, { paddingBottom: insets.bottom + spacing.md }]}>
        <View>
          <Text style={styles.barLabel}>To pay</Text>
          <Text style={styles.barTotal}>{inr(total)}</Text>
        </View>
        <Button
          label="Place order"
          size="lg"
          loading={placing}
          onPress={() => void placeOrder()}
          style={styles.barButton}
          accessibilityHint="Creates your cash-on-delivery order"
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  loading: { padding: spacing.lg, gap: spacing.md },
  content: { padding: spacing.lg },

  chips: { gap: spacing.sm, paddingBottom: spacing.sm },
  selectedLine: { ...type.small, color: colors.muted, marginTop: spacing.sm },

  section: { marginTop: spacing.xxl },

  payMethod: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, borderColor: colors.green600 },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.green700,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.green700 },
  payTitle: { ...type.bodyStrong, color: colors.ink },
  payBody: { ...type.small, color: colors.muted, marginTop: 2 },
  payNote: { ...type.caption, fontWeight: '400', color: colors.mutedLight, marginTop: spacing.md, lineHeight: 16 },

  summaryTitle: { ...type.h3, color: colors.ink, marginBottom: spacing.sm },
  disclaimer: { ...type.small, color: colors.mutedLight, textAlign: 'center', marginTop: spacing.lg },

  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    ...shadow.md,
  },
  barLabel: { ...type.small, color: colors.muted },
  barTotal: { ...type.h2, color: colors.ink },
  barButton: { flex: 1 },
});
