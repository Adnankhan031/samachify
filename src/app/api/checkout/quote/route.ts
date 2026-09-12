import { NextResponse } from 'next/server'
import { getCurrentUserId, OrderError, priceCart, validateCustomer } from '@/lib/orders'
export async function POST(request: Request) {
  try {
    if (!await getCurrentUserId(request)) return NextResponse.json({error:'Sign in to check delivery.'}, {status:401})
    const body = await request.json()
    const cart = await priceCart(body.items, validateCustomer(body.customer))
    return NextResponse.json(cart)
  } catch(error) {
    return NextResponse.json({error: error instanceof OrderError ? error.message : 'Delivery quote unavailable. Please try again.'}, {status: error instanceof OrderError ? error.status : 503})
  }
}
