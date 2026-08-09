/**
 * Turning the device's GPS fix into something that can be typed into an address
 * form. Reverse geocoding here uses the platform geocoder, so no Google Maps API
 * key is involved and it works in Expo Go.
 *
 * Nothing is stored: we read a position once, convert it to fields, and hand
 * them back for the customer to check and correct. A geocoder is a suggestion,
 * never the final address — it routinely gets the house number wrong.
 */
import * as Location from 'expo-location';

export interface ResolvedPlace {
  houseNo: string;
  area: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
}

/** Distinguishes "said no" from "it broke" so the UI can respond differently. */
export class LocationDenied extends Error {
  constructor(message = 'Location permission is off. Turn it on to use your current location.') {
    super(message);
    this.name = 'LocationDenied';
  }
}

export class LocationUnavailable extends Error {
  constructor(message = "Couldn't get your location. Enter the address manually instead.") {
    super(message);
    this.name = 'LocationUnavailable';
  }
}

/**
 * Ask once, read once, geocode once.
 *
 * `Balanced` accuracy is deliberate: `High` spins the GPS radio for many extra
 * seconds to gain metres that a street address does not need.
 */
export async function resolveCurrentPlace(): Promise<ResolvedPlace> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== Location.PermissionStatus.GRANTED) throw new LocationDenied();

  let position: Location.LocationObject;
  try {
    position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
  } catch {
    throw new LocationUnavailable();
  }

  let places: Location.LocationGeocodedAddress[];
  try {
    places = await Location.reverseGeocodeAsync({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  } catch {
    throw new LocationUnavailable();
  }

  const place = places[0];
  if (!place) throw new LocationUnavailable();

  return {
    // `name` is usually the street number or building; `street` the road.
    houseNo: place.name ?? '',
    area: [place.street, place.district].filter(Boolean).join(', '),
    landmark: '',
    city: place.city ?? place.subregion ?? '',
    state: place.region ?? '',
    pincode: (place.postalCode ?? '').replace(/\D/g, '').slice(0, 6),
  };
}

/** Whether permission is already granted, so the UI can skip an unnecessary prompt. */
export async function hasLocationPermission(): Promise<boolean> {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    return status === Location.PermissionStatus.GRANTED;
  } catch {
    return false;
  }
}
