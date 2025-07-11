import { NextRequest, NextResponse } from 'next/server'

const paypalBaseURL = process.env.PAYPAL_API_URL ?? 'https://api-m.sandbox.paypal.com'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { orderID } = body

    if (!orderID) {
      return NextResponse.json({ error: 'Missing orderID' }, { status: 400 })
    }

    const clientId = process.env.PAYPAL_CLIENT_ID
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: 'Missing PayPal credentials in environment variables' }, { status: 500 })
    }

    // Get OAuth token from PayPal
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    const tokenRes = await fetch(`${paypalBaseURL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    })

    const tokenData = await tokenRes.json()
    const access_token = tokenData.access_token

    if (!access_token) {
      return NextResponse.json({ error: 'Unable to get access token from PayPal' }, { status: 500 })
    }

    // Capture the order
    const captureRes = await fetch(`${paypalBaseURL}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
    })

    const captureData = await captureRes.json()

    if (!captureRes.ok) {
      return NextResponse.json({ error: captureData }, { status: captureRes.status })
    }

    return NextResponse.json(captureData, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 })
  }
}
