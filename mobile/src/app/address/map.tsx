import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, type Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Screen, ScreenHeader } from '@/components/ui';
import { currentCoords, resolvePoint, setPickedPlace, type ResolvedPlace } from '@/lib/location';
import { colors, radius, shadow, spacing, type } from '@/theme';

/** Chennai, where Samachify delivers — the sensible fallback centre. */
const CHENNAI: Region = {
  latitude: 13.0827,
  longitude: 80.2707,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

/**
 * Drop-a-pin address picker.
 *
 * Uses the centre-pin pattern: the marker is fixed to the middle of the screen
 * and the map moves beneath it. It beats a draggable marker on a phone because
 * the customer's thumb never covers the thing they're aiming at.
 *
 * Geocoding runs when the map settles, not while it moves — one lookup per
 * gesture instead of dozens.
 */
export default function MapPicker() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);

  const [region, setRegion] = useState<Region>(CHENNAI);
  const [place, setPlace] = useState<ResolvedPlace | null>(null);
  const [resolving, setResolving] = useState(false);
  const [centring, setCentring] = useState(true);

  const lookup = useCallback(async (next: Region) => {
    setResolving(true);
    const found = await resolvePoint(next.latitude, next.longitude);
    setPlace(found);
    setResolving(false);
  }, []);

  // Centre on the customer if they'll allow it; otherwise stay on Chennai.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const coords = await currentCoords();
      if (cancelled) return;
      const next = coords ? { ...CHENNAI, ...coords, latitudeDelta: 0.008, longitudeDelta: 0.008 } : CHENNAI;
      setRegion(next);
      mapRef.current?.animateToRegion(next, 600);
      setCentring(false);
      void lookup(next);
    })();
    return () => {
      cancelled = true;
    };
  }, [lookup]);

  const confirm = () => {
    if (!place) return;
    setPickedPlace(place);
    router.back();
  };

  const recentre = async () => {
    setCentring(true);
    const coords = await currentCoords();
    setCentring(false);
    if (!coords) return;
    const next = { ...region, ...coords, latitudeDelta: 0.008, longitudeDelta: 0.008 };
    mapRef.current?.animateToRegion(next, 500);
  };

  const line = place
    ? [place.houseNo, place.area, place.city].filter(Boolean).join(', ')
    : null;

  return (
    <Screen>
      <ScreenHeader title="Pick your location" subtitle="Move the map to place the pin" />

      <View style={styles.mapWrap}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFill}
          initialRegion={CHENNAI}
          onRegionChangeComplete={(next) => {
            setRegion(next);
            void lookup(next);
          }}
          showsUserLocation
          showsMyLocationButton={false}
          toolbarEnabled={false}
        />

        {/* Fixed centre pin. pointerEvents none so it never eats a pan gesture. */}
        <View style={styles.pinWrap} pointerEvents="none">
          <Ionicons name="location" size={40} color={colors.leaf} />
          <View style={styles.pinShadow} />
        </View>

        <Pressable
          onPress={() => void recentre()}
          accessibilityRole="button"
          accessibilityLabel="Centre on my location"
          style={({ pressed }) => [styles.recentre, pressed && { opacity: 0.7 }]}
        >
          {centring ? (
            <ActivityIndicator size="small" color={colors.leaf} />
          ) : (
            <Ionicons name="locate" size={20} color={colors.leaf} />
          )}
        </Pressable>
      </View>

      <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg }]}>
        <View style={styles.readout}>
          <Ionicons name="location-outline" size={18} color={colors.leaf} />
          <View style={styles.readoutText}>
            <Text style={styles.readoutLabel}>Delivering to</Text>
            {resolving ? (
              <Text style={styles.readoutValue}>Finding this place…</Text>
            ) : line ? (
              <>
                <Text style={styles.readoutValue} numberOfLines={2}>
                  {line}
                </Text>
                {place?.pincode ? (
                  <Text style={styles.readoutPin}>Pincode {place.pincode}</Text>
                ) : null}
              </>
            ) : (
              <Text style={styles.readoutValue}>No address found here</Text>
            )}
          </View>
        </View>

        <Text style={styles.note}>
          We&apos;ll fill the form from this pin. You can still correct the flat number and
          landmark before saving.
        </Text>

        <Button
          label="Use this location"
          size="lg"
          fullWidth
          disabled={!place || resolving}
          onPress={confirm}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  mapWrap: { flex: 1, overflow: 'hidden' },

  pinWrap: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    // Lift the glyph so its tip, not its centre, marks the point.
    marginBottom: 34,
  },
  pinShadow: {
    width: 12,
    height: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(11,22,6,0.25)',
    marginTop: -4,
  },

  recentre: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.lifted,
  },

  sheet: {
    backgroundColor: colors.paper,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.md,
    ...shadow.lifted,
  },
  readout: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  readoutText: { flex: 1 },
  readoutLabel: { ...type.eyebrow, color: colors.muted },
  readoutValue: { ...type.bodyStrong, color: colors.ink, marginTop: 2 },
  readoutPin: { ...type.tiny, color: colors.muted, marginTop: 2 },
  note: { ...type.tiny, color: colors.faint, lineHeight: 16 },
});
