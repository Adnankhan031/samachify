import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
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
import { takePickedPlace } from '@/lib/location';
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
  latitude: number | null;
  longitude: number | null;
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
  latitude: null,
  longitude: null,
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
  const pinned = form.latitude !== null && form.longitude !== null;

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
            latitude: found.latitude ?? null,
            longitude: found.longitude ?? null,
          });
        }
      })
      .catch(() => setBanner('Could not load that address.'))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Apply whatever the map picker left behind. `take` clears it, so returning
  // to this screen later doesn't silently re-apply an old pin.
  useFocusEffect(
    useCallback(() => {
      const picked = takePickedPlace();
      if (!picked) return;
      setForm((f) => ({
        ...f,
        // The geocoder's guesses only fill blanks — they never overwrite text
        // the customer has already corrected. The coordinates always win,
        // because the pin *is* the delivery point.
        houseNo: f.houseNo || picked.houseNo,
        area: f.area || picked.area,
        city: f.city || picked.city,
        state: f.state || picked.state,
        pincode: f.pincode || picked.pincode,
        latitude: picked.latitude,
        longitude: picked.longitude,
      }));
      setErrors({});
      setBanner(null);
    }, [])
  );

  const set = (field: keyof FormState) => (value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: undefined }));
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
    // Required: without it a delivery partner has text and a guess.
    if (form.latitude === null || form.longitude === null) {
      next.latitude = 'Set your delivery location on the map';
    }

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
      latitude: form.latitude,
      longitude: form.longitude,
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

          {/* The pin is the delivery destination, so it leads the form. The
              customer always places it themselves — nothing is auto-filled from
              GPS, which only centres the map inside the picker. */}
          <Pressable
            onPress={() => router.push('/address/map')}
            accessibilityRole="button"
            accessibilityLabel={
              pinned ? 'Delivery location pinned. Change it' : 'Set your delivery location on the map'
            }
            style={({ pressed }) => [
              styles.pin,
              pinned ? styles.pinSet : styles.pinUnset,
              !!errors.latitude && styles.pinError,
              pressed && { opacity: 0.8 },
            ]}
          >
            <View style={[styles.pinIcon, pinned && styles.pinIconSet]}>
              <Ionicons
                name={pinned ? 'checkmark' : 'map-outline'}
                size={19}
                color={pinned ? colors.bark : colors.leaf}
              />
            </View>

            <View style={styles.flex}>
              <Text style={[styles.pinTitle, pinned && { color: colors.onDark }]}>
                {pinned ? 'Delivery location pinned' : 'Set delivery location'}
              </Text>
              <Text style={[styles.pinBody, pinned && { color: colors.onDarkMuted }]}>
                {pinned
                  ? 'Your rider navigates to this exact point. Tap to move it.'
                  : 'Drop a pin on the map so your rider knows exactly where to come.'}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={16}
              color={pinned ? colors.onDarkMuted : colors.faint}
            />
          </Pressable>

          {errors.latitude ? (
            <View style={styles.pinErrorRow}>
              <Ionicons name="alert-circle" size={13} color={colors.chilli} />
              <Text style={styles.pinErrorText}>{errors.latitude}</Text>
            </View>
          ) : null}

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

  pin: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radius.md,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
    borderWidth: 1.5,
    ...shadow.card,
  },
  // Unset reads as an instruction; set reads as a confirmation.
  pinUnset: { backgroundColor: colors.paper, borderColor: colors.lineStrong, borderStyle: 'dashed' },
  pinSet: { backgroundColor: colors.bark, borderColor: colors.bark },
  pinError: { borderColor: colors.chilli, borderStyle: 'solid' },
  pinIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.wash,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinIconSet: { backgroundColor: colors.sprout },
  pinTitle: { ...type.h3, color: colors.ink },
  pinBody: { ...type.tiny, color: colors.muted, marginTop: 2 },
  pinErrorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: -spacing.lg,
    marginBottom: spacing.lg,
  },
  pinErrorText: { ...type.tiny, color: colors.chilli, flex: 1 },

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
