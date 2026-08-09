import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
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

import {
  Button,
  Card,
  Chip,
  ErrorBanner,
  Input,
  Screen,
  ScreenHeader,
  Skeleton,
} from '@/components/ui';
import {
  createAddress,
  listAddresses,
  updateAddress,
  type Address,
  type AddressInput,
} from '@/lib/addresses';
import { LocationDenied, resolveCurrentPlace } from '@/lib/location';
import { colors, radius, shadow, spacing, type } from '@/theme';

const LABELS = ['Home', 'Work', 'Other'] as const;

interface FormState {
  label: string;
  name: string;
  phone: string;
  houseNo: string;
  area: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

const EMPTY: FormState = {
  label: 'Home',
  name: '',
  phone: '',
  houseNo: '',
  area: '',
  landmark: '',
  city: '',
  state: 'Tamil Nadu',
  pincode: '',
  isDefault: false,
};

/**
 * Add or edit a saved address. Same `addresses` table the website uses, so
 * anything saved here shows up in the web checkout too.
 *
 * GPS fills the form in; it never submits on its own. A reverse geocode is a
 * good guess at the street and a poor guess at the flat number, so the customer
 * always gets to correct it before saving.
 */
export default function AddressEdit() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const editing = Boolean(id);

  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [banner, setBanner] = useState<string | null>(null);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    listAddresses()
      .then((list) => {
        if (cancelled) return;
        const found = list.find((a: Address) => a.id === id);
        if (found) {
          setForm({
            label: found.label || 'Home',
            name: found.name,
            phone: found.phone,
            houseNo: found.house_no,
            area: found.area,
            landmark: found.landmark,
            city: found.city,
            state: found.state,
            pincode: found.pincode,
            isDefault: found.is_default,
          });
        }
      })
      .catch(() => setBanner('Could not load that address.'))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [id]);

  const set = (field: keyof FormState) => (value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const useMyLocation = async () => {
    setLocating(true);
    setBanner(null);

    try {
      const place = await resolveCurrentPlace();
      setForm((f) => ({
        ...f,
        // Only overwrite what the geocoder actually returned — a blank result
        // shouldn't wipe something the customer already typed.
        houseNo: place.houseNo || f.houseNo,
        area: place.area || f.area,
        city: place.city || f.city,
        state: place.state || f.state,
        pincode: place.pincode || f.pincode,
      }));
      setErrors({});
    } catch (e) {
      setBanner(
        e instanceof LocationDenied || e instanceof Error
          ? e.message
          : 'Could not read your location.'
      );
    } finally {
      setLocating(false);
    }
  };

  /** Mirrors the server's validation so we fail before a round trip. */
  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};

    if (!form.name.trim()) next.name = 'Enter the recipient name';
    if (!/^[0-9]{10}$/.test(form.phone.replace(/\D/g, ''))) next.phone = 'Enter a 10-digit mobile number';
    if (!form.houseNo.trim()) next.houseNo = 'Enter the house or flat number';
    if (!form.area.trim()) next.area = 'Enter the area or street';
    if (!form.city.trim()) next.city = 'Enter the city';
    if (!/^[0-9]{6}$/.test(form.pincode)) next.pincode = 'Enter a 6-digit pincode';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const save = async () => {
    if (!validate()) return;

    setSaving(true);
    setBanner(null);

    const payload: AddressInput = {
      label: form.label,
      name: form.name.trim(),
      phone: form.phone.replace(/\D/g, ''),
      house_no: form.houseNo.trim(),
      area: form.area.trim(),
      landmark: form.landmark.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      pincode: form.pincode,
      is_default: form.isDefault,
    };

    try {
      if (id) await updateAddress(id, payload);
      else await createAddress(payload);
      router.back();
    } catch (e) {
      setBanner(e instanceof Error ? e.message : 'Could not save this address.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Screen>
        <ScreenHeader title="Edit address" />
        <View style={styles.loading}>
          <Skeleton height={64} radius={radius.md} />
          <Skeleton height={220} radius={radius.md} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScreenHeader title={editing ? 'Edit address' : 'Add address'} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 120 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {banner ? <ErrorBanner message={banner} /> : null}

          <Pressable
            onPress={() => void useMyLocation()}
            disabled={locating}
            accessibilityRole="button"
            accessibilityLabel="Use my current location to fill this form"
            style={({ pressed }) => [styles.gps, pressed && { opacity: 0.75 }]}
          >
            <View style={styles.gpsIcon}>
              <Ionicons name={locating ? 'ellipsis-horizontal' : 'navigate'} size={18} color={colors.bark} />
            </View>
            <View style={styles.flex}>
              <Text style={styles.gpsTitle}>
                {locating ? 'Finding you…' : 'Use my current location'}
              </Text>
              <Text style={styles.gpsBody}>
                Fills in the street and pincode. Check them before saving.
              </Text>
            </View>
            {!locating ? <Ionicons name="chevron-forward" size={16} color={colors.onDarkMuted} /> : null}
          </Pressable>

          <Text style={styles.groupLabel}>Save as</Text>
          <View style={styles.labels}>
            {LABELS.map((label) => (
              <Chip
                key={label}
                label={label}
                icon={label === 'Home' ? 'home-outline' : label === 'Work' ? 'briefcase-outline' : 'location-outline'}
                active={form.label === label}
                onPress={() => set('label')(label)}
              />
            ))}
          </View>

          <Text style={styles.groupLabel}>Contact</Text>
          <Input
            label="Recipient name"
            icon="person-outline"
            value={form.name}
            onChangeText={set('name')}
            autoCapitalize="words"
            error={errors.name}
          />
          <Input
            label="Mobile number"
            icon="call-outline"
            value={form.phone}
            onChangeText={(v) => set('phone')(v.replace(/\D/g, ''))}
            keyboardType="number-pad"
            maxLength={10}
            error={errors.phone}
          />

          <Text style={styles.groupLabel}>Address</Text>
          <Input
            label="House / flat number"
            value={form.houseNo}
            onChangeText={set('houseNo')}
            autoCapitalize="words"
            error={errors.houseNo}
          />
          <Input
            label="Area / street"
            value={form.area}
            onChangeText={set('area')}
            autoCapitalize="words"
            error={errors.area}
          />
          <Input
            label="Landmark"
            value={form.landmark}
            onChangeText={set('landmark')}
            autoCapitalize="words"
            hint="Optional — helps the delivery partner find you."
          />
          <Input
            label="City"
            value={form.city}
            onChangeText={set('city')}
            autoCapitalize="words"
            error={errors.city}
          />
          <Input
            label="State"
            value={form.state}
            onChangeText={set('state')}
            autoCapitalize="words"
          />
          <Input
            label="Pincode"
            value={form.pincode}
            onChangeText={(v) => set('pincode')(v.replace(/\D/g, ''))}
            keyboardType="number-pad"
            maxLength={6}
            error={errors.pincode}
            editable={!editing}
            hint={editing ? 'Pincode cannot be changed — add a new address instead.' : undefined}
          />

          <Pressable
            onPress={() => setForm((f) => ({ ...f, isDefault: !f.isDefault }))}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: form.isDefault }}
            accessibilityLabel="Set as default address"
            style={({ pressed }) => [pressed && { opacity: 0.7 }]}
          >
            <Card style={styles.defaultRow}>
              <View style={[styles.check, form.isDefault && styles.checkOn]}>
                {form.isDefault ? <Ionicons name="checkmark" size={14} color={colors.onDark} /> : null}
              </View>
              <View style={styles.flex}>
                <Text style={styles.defaultTitle}>Set as default</Text>
                <Text style={styles.defaultBody}>Used automatically at checkout.</Text>
              </View>
            </Card>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={[styles.bar, { paddingBottom: insets.bottom + spacing.md }]}>
        <Button
          label={editing ? 'Save changes' : 'Save address'}
          size="lg"
          fullWidth
          loading={saving}
          onPress={() => void save()}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  loading: { padding: spacing.lg, gap: spacing.md },
  content: { padding: spacing.lg },

  gps: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.bark,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
    ...shadow.card,
  },
  gpsIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.sprout,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpsTitle: { ...type.h3, color: colors.onDark },
  gpsBody: { ...type.tiny, color: colors.onDarkMuted, marginTop: 2 },

  groupLabel: { ...type.eyebrow, color: colors.muted, marginBottom: spacing.md },
  labels: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xxl },

  defaultRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginTop: spacing.sm },
  check: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkOn: { backgroundColor: colors.leaf, borderColor: colors.leaf },
  defaultTitle: { ...type.bodyStrong, color: colors.ink },
  defaultBody: { ...type.tiny, color: colors.muted, marginTop: 1 },

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
