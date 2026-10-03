export class PlacesError extends Error {
  constructor(message: string, public status = 503) {
    super(message)
    this.name = 'PlacesError'
  }
}

function apiKey() {
  // A dedicated key is preferred. The existing server-only Routes key is a
  // safe fallback when its Google Cloud API restriction also allows Places
  // API (New), avoiding any key inside the mobile bundle.
  const key = process.env.GOOGLE_PLACES_API_KEY ?? process.env.GOOGLE_ROUTES_API_KEY
  if (!key) throw new PlacesError('Address search is being configured. Use your current location for now.')
  return key
}

export interface PlaceSuggestion {
  placeId: string
  title: string
  subtitle: string
}

export async function autocompleteAddress(query: string, sessionToken: string): Promise<PlaceSuggestion[]> {
  const response = await fetch('https://places.googleapis.com/v1/places:autocomplete', {
    method: 'POST',
    cache: 'no-store',
    signal: AbortSignal.timeout(8000),
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey(),
      'X-Goog-FieldMask': 'suggestions.placePrediction.placeId,suggestions.placePrediction.structuredFormat',
    },
    body: JSON.stringify({
      input: query,
      sessionToken,
      includedRegionCodes: ['in'],
      languageCode: 'en',
      regionCode: 'IN',
      locationBias: {
        circle: {
          center: { latitude: 12.9716, longitude: 80.2212 },
          radius: 80000,
        },
      },
    }),
  })

  const data = await response.json().catch(() => null) as {
    suggestions?: Array<{ placePrediction?: {
      placeId?: string
      structuredFormat?: { mainText?: { text?: string }, secondaryText?: { text?: string } }
    }}>
    error?: { message?: string }
  } | null

  if (!response.ok) throw new PlacesError('Address search is temporarily unavailable. Use your current location or try again later.')

  return (data?.suggestions ?? []).flatMap(({ placePrediction }) => {
    if (!placePrediction?.placeId || !placePrediction.structuredFormat?.mainText?.text) return []
    return [{
      placeId: placePrediction.placeId,
      title: placePrediction.structuredFormat.mainText.text,
      subtitle: placePrediction.structuredFormat.secondaryText?.text ?? '',
    }]
  }).slice(0, 6)
}

type AddressComponent = { longText?: string, types?: string[] }

function component(components: AddressComponent[], ...types: string[]) {
  return components.find(item => types.some(type => item.types?.includes(type)))?.longText ?? ''
}

export async function placeDetails(placeId: string, sessionToken: string) {
  const url = new URL(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`)
  url.searchParams.set('sessionToken', sessionToken)
  url.searchParams.set('languageCode', 'en')
  url.searchParams.set('regionCode', 'IN')

  const response = await fetch(url, {
    cache: 'no-store',
    signal: AbortSignal.timeout(8000),
    headers: {
      'X-Goog-Api-Key': apiKey(),
      'X-Goog-FieldMask': 'id,displayName,formattedAddress,addressComponents,location',
    },
  })
  const data = await response.json().catch(() => null) as {
    id?: string
    displayName?: { text?: string }
    formattedAddress?: string
    addressComponents?: AddressComponent[]
    location?: { latitude?: number, longitude?: number }
    error?: { message?: string }
  } | null

  if (!response.ok || !data?.location || !Number.isFinite(data.location.latitude) || !Number.isFinite(data.location.longitude)) {
    throw new PlacesError('That address could not be opened. Please choose another result.')
  }

  const parts = data.addressComponents ?? []
  const locality = component(parts, 'locality', 'postal_town', 'administrative_area_level_3')
  const sublocality = component(parts, 'sublocality_level_1', 'sublocality', 'neighborhood')
  const route = component(parts, 'route')
  const streetNumber = component(parts, 'street_number', 'premise')

  return {
    placeId: data.id ?? placeId,
    label: data.displayName?.text ?? sublocality ?? locality ?? 'Selected location',
    address: data.formattedAddress ?? '',
    area: [route, sublocality].filter(Boolean).join(', '),
    houseNo: streetNumber,
    city: locality,
    state: component(parts, 'administrative_area_level_1'),
    pincode: component(parts, 'postal_code').replace(/\D/g, '').slice(0, 6),
    latitude: data.location.latitude as number,
    longitude: data.location.longitude as number,
  }
}
