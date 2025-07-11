'use client'


import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'


export default function ThankYouPage() {
  const searchParams = useSearchParams()
  const orderID = searchParams.get('token') // PayPal token
  const payerID = searchParams.get('PayerID') // Optional: PayPal payer info
  const [isCapturing, setIsCapturing] = useState(false)
  const [captureStatus, setCaptureStatus] = useState<string | null>(null)

    useEffect(() => {
    if (orderID) {
        setIsCapturing(true)

        fetch('/api/capture-paypal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderID }),
        })
        .then(async res => {
            const data = await res.json()

            console.log('PayPal capture response:', data)

            if (!res.ok) {
            console.error('PayPal capture failed:', data)
            setCaptureStatus('Payment capture failed or incomplete. Please contact us to info@asukamethod.com')
            return
            }

            if (data?.status === 'COMPLETED') {
            setCaptureStatus('Payment captured successfully. You will receive the email the class link soon in your inbox(if you don\'t find it, please check your spam/junk box too)! In case, if you don\'t receive an email, please contact us to info@asukamethod.com')
            } else {
            console.warn('PayPal payment not completed:', data)
            setCaptureStatus('Payment capture incomplete. Please contact us to info@asukamethod.com')
            }
        })
        .catch(err => {
            console.error('Network or server error:', err)
            setCaptureStatus('Error capturing payment. Please contact us to info@asukamethod.com')
        })
        .finally(() => setIsCapturing(false))
    }
    }, [orderID])

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-4">Thank you for your payment!</h1>

      {orderID ? (
        <>
          <p>Processing PayPal payment...</p>
          {isCapturing && <p>Capturing payment...</p>}
          {captureStatus && <p>{captureStatus}</p>}

          <b>Asuka Method</b>
        </>
      ) : (
        <>
            <p>You will receive the email the class link soon in your inbox (if you don't find it, please check your spam/junk box too)!
            In case, if you don' receive an email, please contact us to info@asukamethod.com

            Thank you!
            <b>Asuka Method</b>
            </p>
        </>
      )}
    </div>
  )
}