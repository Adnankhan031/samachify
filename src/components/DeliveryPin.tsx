'use client'

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import { OPERATING_OFFICE } from '@/lib/office'

export type DeliveryPoint = { latitude: number; longitude: number }

export default function DeliveryPin({ value, onChange }: { value: DeliveryPoint | null; onChange: (point: DeliveryPoint) => void }) {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  const node = useRef<HTMLDivElement>(null)
  const map = useRef<google.maps.Map | null>(null)
  const marker = useRef<google.maps.Marker | null>(null)
  const callback = useRef(onChange)
  callback.current = onChange
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState('')
  const [manualLatitude, setManualLatitude] = useState('')
  const [manualLongitude, setManualLongitude] = useState('')
  useEffect(() => {
    if (!loaded || !node.current) return
    // Initial viewport only. Never treated as a selected customer or dispatch pin.
    const instance = new google.maps.Map(node.current, { center: { lat: OPERATING_OFFICE.latitude, lng: OPERATING_OFFICE.longitude }, zoom: 13, streetViewControl: false, mapTypeControl: false })
    map.current = instance
    const pin = new google.maps.Marker({ map: instance, draggable: true, visible: false })
    marker.current = pin
    const select = (location: google.maps.LatLng | null | undefined) => {
      if (location) callback.current({ latitude: location.lat(), longitude: location.lng() })
    }
    const click = instance.addListener('click', (e: google.maps.MapMouseEvent) => select(e.latLng))
    const drag = pin.addListener('dragend', () => select(pin.getPosition()))
    return () => { click.remove(); drag.remove(); pin.setMap(null); map.current = null; marker.current = null }
  }, [loaded])
  useEffect(() => {
    marker.current?.setVisible(!!value)
    if (value) {
      const location = { lat: value.latitude, lng: value.longitude }
      marker.current?.setPosition(location)
      map.current?.panTo(location)
    }
  }, [value, loaded])
  useEffect(() => {
    if (!value) return
    setManualLatitude(String(value.latitude))
    setManualLongitude(String(value.longitude))
  }, [value])
  const applyManualCoordinates = () => {
    const latitude = Number(manualLatitude)
    const longitude = Number(manualLongitude)
    if (!manualLatitude.trim() || !manualLongitude.trim() || !Number.isFinite(latitude) || !Number.isFinite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
      setError('Enter a valid latitude and longitude.')
      return
    }
    setError('')
    onChange({ latitude, longitude })
  }
  return <section className="my-5 rounded-2xl border border-green-200 bg-green-50 p-4">
    <h3 className="font-bold text-green-950">Pin your delivery location</h3>
    <p className="my-2 text-sm">Tap the map at your entrance, then drag the pin to adjust it. Your delivery partner receives this exact point.</p>
    {key ? <>
      <Script id="delivery-google-maps" src={`https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}`} onReady={() => setLoaded(true)} onError={() => setError('The map could not load. Please retry.')} />
      <div ref={node} className="h-72 w-full rounded-xl" aria-label="Delivery location map" />
    </> : <p className="text-sm text-amber-900">The delivery map is being configured. Location coordinates can still be entered below.</p>}
    <button type="button" className="my-3 rounded-xl border border-green-700 px-4 py-3" onClick={() => {
      if (!navigator.geolocation) { setError('Location is not supported by this browser.'); return }
      navigator.geolocation.getCurrentPosition(p => { setError(''); onChange({ latitude: p.coords.latitude, longitude: p.coords.longitude }) }, () => setError('Location permission was denied. Tap the map to choose your location.'), { enableHighAccuracy: true, timeout: 12000 })
    }}>Use my current location</button>
    <div className="grid grid-cols-2 gap-3">
      <label className="text-sm">Latitude<input className="w-full rounded-lg border p-3" type="number" min="-90" max="90" step="any" value={manualLatitude} onChange={e => setManualLatitude(e.target.value)} /></label>
      <label className="text-sm">Longitude<input className="w-full rounded-lg border p-3" type="number" min="-180" max="180" step="any" value={manualLongitude} onChange={e => setManualLongitude(e.target.value)} /></label>
    </div>
    <button type="button" className="rounded-xl bg-green-700 px-4 py-3 font-semibold text-white" onClick={applyManualCoordinates}>Use these coordinates</button>
    {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
  </section>
}
