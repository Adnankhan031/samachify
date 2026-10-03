import { NextResponse } from 'next/server'
import { autocompleteAddress, PlacesError } from '@/lib/places'

export async function POST(request: Request) {
  try {
    const body = await request.json() as { query?: unknown, sessionToken?: unknown }
    const query = typeof body.query === 'string' ? body.query.trim() : ''
    const sessionToken = typeof body.sessionToken === 'string' ? body.sessionToken.trim() : ''
    if (query.length < 3 || query.length > 120 || sessionToken.length < 8 || sessionToken.length > 100) {
      return NextResponse.json({ error: 'Enter at least 3 characters to search.' }, { status: 400 })
    }
    return NextResponse.json({ suggestions: await autocompleteAddress(query, sessionToken) })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof PlacesError ? error.message : 'Address search is temporarily unavailable.' },
      { status: error instanceof PlacesError ? error.status : 503 },
    )
  }
}
