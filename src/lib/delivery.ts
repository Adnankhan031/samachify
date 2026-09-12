import { DELIVERY_PINCODES, OPERATING_OFFICE } from './office'
import { OrderError, type Customer } from './orders'

export function deliveryCharge(subtotal: number, roadMeters: number): number {
  if (!Number.isFinite(subtotal) || subtotal < 0 || !Number.isFinite(roadMeters) || roadMeters < 0) throw new Error('Invalid delivery calculation')
  // Whole-rupee order totals: round the final fee upward, not each kilometre.
  return subtotal > 379 || roadMeters < 2000 ? 0 : Math.ceil(roadMeters * 5 / 1000)
}

export async function quoteDelivery(customer: Customer, subtotal: number) {
  const key = process.env.GOOGLE_ROUTES_API_KEY
  const lat = process.env.DISPATCH_LATITUDE ?? String(OPERATING_OFFICE.latitude)
  const lng = process.env.DISPATCH_LONGITUDE ?? String(OPERATING_OFFICE.longitude)
  const configuredPincodes = (process.env.DELIVERY_PINCODES ?? '').split(',').map(p => p.trim()).filter(Boolean)
  const pincodes = configuredPincodes.length ? configuredPincodes : DELIVERY_PINCODES
  if (!key || !lat?.trim() || !lng?.trim() || !pincodes.length || !Number.isFinite(Number(lat)) || !Number.isFinite(Number(lng)) || Math.abs(Number(lat)) > 90 || Math.abs(Number(lng)) > 180) {
    throw new OrderError('Delivery is being configured. Please contact Samachify to place your order.', 503)
  }
  if (!pincodes.includes(customer.pincode)) throw new OrderError('Delivery is not available for your pincode yet.')
  if (customer.latitude == null || customer.longitude == null) throw new OrderError('Select your exact delivery location on the map.')
  // Verify the selected point belongs to the entered service area.
  const geoResponse = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${customer.latitude},${customer.longitude}&key=${encodeURIComponent(key)}`, { signal: AbortSignal.timeout(10000), cache: 'no-store' })
  const geo = await geoResponse.json()
  const postal = (geo.results ?? []).flatMap((r: { address_components: { types: string[]; long_name: string }[] }) => r.address_components ?? []).find((c: { types: string[] }) => c.types.includes('postal_code'))?.long_name
  if (!geoResponse.ok || geo.status !== 'OK' || !postal) throw new OrderError('Could not verify your delivery area. Please try again.', 503)
  if (postal !== customer.pincode || !pincodes.includes(postal)) throw new OrderError('Your map pin does not match an available delivery pincode. Please check the address and pin.')
  const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
    method: 'POST', signal: AbortSignal.timeout(10000), cache: 'no-store',
    headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'routes.distanceMeters' },
    body: JSON.stringify({
      origin: { location: { latLng: { latitude: Number(lat), longitude: Number(lng) } } },
      destination: { location: { latLng: { latitude: customer.latitude, longitude: customer.longitude } } },
      travelMode: 'DRIVE', routingPreference: 'TRAFFIC_UNAWARE', computeAlternativeRoutes: false,
    }),
  })
  const data = await response.json()
  const roadMeters = data.routes?.[0]?.distanceMeters
  if (!response.ok || typeof roadMeters !== 'number' || roadMeters < 0) throw new OrderError('Could not calculate a road route to this location. Please try again.', 503)
  return { roadMeters, deliveryFee: deliveryCharge(subtotal, roadMeters) }
}
