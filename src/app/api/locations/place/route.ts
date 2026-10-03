import { NextResponse } from 'next/server'
import { placeDetails, PlacesError } from '@/lib/places'

export async function POST(request: Request) {
  try {
    const body = await request.json() as { placeId?: unknown, sessionToken?: unknown }
    const placeId = typeof body.placeId === 'string' ? body.placeId.trim() : ''
    const sessionToken = typeof body.sessionToken === 'string' ? body.sessionToken.trim() : ''
    if (!/^[A-Za-z0-9_-]{10,300}$/.test(placeId) || sessionToken.length < 8 || sessionToken.length > 100) {
      return NextResponse.json({ error: 'Choose a valid address result.' }, { status: 400 })
    }
    return NextResponse.json(await placeDetails(placeId, sessionToken))
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof PlacesError ? error.message : 'That address could not be opened.' },
      { status: error instanceof PlacesError ? error.status : 503 },
    )
  }
}
