import { DELIVERY_PINCODES, OPERATING_OFFICE } from './office'
import { OrderError, type Customer } from './orders'

export function deliveryCharge(subtotal: number, roadMeters: number): number {
  if (!Number.isFinite(subtotal) || subtotal < 0 || !Number.isFinite(roadMeters) || roadMeters < 0) throw new Error('Invalid delivery calculation')
  // Whole-rupee order totals: round the final fee upward, not each kilometre.
  return subtotal > 379 || roadMeters < 2000 ? 0 : Math.ceil(roadMeters * 5 / 1000)
}

function distanceInMeters(from: { latitude: number; longitude: number }, to: { latitude: number; longitude: number }) {
  const earthRadius = 6_371_000
  const radians = (degrees: number) => degrees * Math.PI / 180
  const dLat = radians(to.latitude - from.latitude)
  const dLng = radians(to.longitude - from.longitude)
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(radians(from.latitude)) * Math.cos(radians(to.latitude)) * Math.sin(dLng / 2) ** 2
  return earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export async function quoteDelivery(customer: Customer, subtotal: number) {
  const key = process.env.GOOGLE_ROUTES_API_KEY
  const lat = process.env.DISPATCH_LATITUDE ?? String(OPERATING_OFFICE.latitude)
  const lng = process.env.DISPATCH_LONGITUDE ?? String(OPERATING_OFFICE.longitude)
  const configuredPincodes = (process.env.DELIVERY_PINCODES ?? '').split(',').map(p => p.trim()).filter(Boolean)
  const pincodes = configuredPincodes.length ? configuredPincodes : DELIVERY_PINCODES
  if (!lat?.trim() || !lng?.trim() || !pincodes.length || !Number.isFinite(Number(lat)) || !Number.isFinite(Number(lng)) || Math.abs(Number(lat)) > 90 || Math.abs(Number(lng)) > 180) {
    throw new OrderError('Delivery is being configured. Please contact Samachify to place your order.', 503)
  }
  if (!pincodes.includes(customer.pincode)) throw new OrderError('Delivery is not available for your pincode yet.')
  if (customer.latitude == null || customer.longitude == null) throw new OrderError('Select your exact delivery location on the map.')

  const office = { latitude: Number(lat), longitude: Number(lng) }
  const destination = { latitude: customer.latitude, longitude: customer.longitude }
  const directMeters = distanceInMeters(office, destination)
  // A valid pincode paired with a pin far outside the Chennai delivery region is
  // almost certainly an accidental map selection. This guard does not depend on
  // a third-party reverse-geocoding API, so a correct pin never fails because a
  // provider could not translate it back into an address.
  if (directMeters > 45_000) throw new OrderError('This pin is outside our current delivery area. Move it to your delivery entrance.')

  let roadMeters = Math.ceil(directMeters * 1.25)
  if (key) {
    try {
      const response = await fetch('https://routes.googleapis.com/directions/v2:computeRoutes', {
        method: 'POST', signal: AbortSignal.timeout(10000), cache: 'no-store',
        headers: { 'Content-Type': 'application/json', 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'routes.distanceMeters' },
        body: JSON.stringify({
          origin: { location: { latLng: office } }, destination: { location: { latLng: destination } },
          travelMode: 'DRIVE', routingPreference: 'TRAFFIC_UNAWARE', computeAlternativeRoutes: false,
        }),
      })
      const data = await response.json()
      if (response.ok && typeof data.routes?.[0]?.distanceMeters === 'number') roadMeters = data.routes[0].distanceMeters
    } catch {
      // The distance estimate above keeps checkout usable during a routes outage.
    }
  }
  return { roadMeters, deliveryFee: deliveryCharge(subtotal, roadMeters) }
}
