'use client'

import { useForm, Controller } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { format, parseISO } from 'date-fns'
import { getClientSideURL } from '@/utilities/getURL'

type BookingFormInputs = {
  name: string
  email: string
  selectedDates: string[]
  paymentMethod: string
}

type OnlineClass = {
  id: string
  date: string
  title?: string
}

export const BookingForm = () => {
  const { handleSubmit, control, register, setValue } = useForm<BookingFormInputs>()
  const [classes, setClasses] = useState<OnlineClass[]>([])

  useEffect(() => {
    const fetchClasses = async () => {
      const res = await fetch('/api/online-classes')
      const data = await res.json()
      setClasses(data.docs || [])
    }

    fetchClasses()
  }, [])

  const onSubmit = async (data: BookingFormInputs) => {

    await fetch(`${getClientSideURL()}/api/bookings`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    console.log("submitted", data)
  }

  // Extract available dates as actual JS Date objects
  const availableDates = classes.map((cls) => ({
    ...cls,
    dateObj: parseISO(cls.date),
  }))

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mb-6">
      <div>
        <label>Choose a class date</label>
        <Controller
          control={control}
          name="selectedDates"
          rules={{ required: true }}
          render={({ field }) => {
            const selectedDates = classes
              .filter((cls) => field.value?.includes(cls.id))
              .map((cls) => parseISO(cls.date))

            return (
              <div className='flex justify-evenly'>
                <DayPicker
                  className='my-custom-picker'
                  mode="multiple"
                  selected={selectedDates}
                  onSelect={(dates) => {
                    if (!dates || !Array.isArray(dates)) return
                  
                    // Match selected dates with available classes
                    const selectedClasses = classes.filter((cls) =>
                      dates.some(
                        (d) => parseISO(cls.date).toDateString() === d.toDateString()
                      )
                    )
                  
                    // Sort classes by their date
                    const sortedClassIds = selectedClasses
                      .sort(
                        (a, b) =>
                          parseISO(a.date).getTime() - parseISO(b.date).getTime()
                      )
                      .map((cls) => cls.id)
                  
                    field.onChange(sortedClassIds)
                  }}

                  disabled={(date) =>
                    !classes.some(
                      (cls) =>
                        parseISO(cls.date).toDateString() === date.toDateString()
                    )
                  }
                />

                    {/*  Show Selected Dates */}
                    {field.value?.length > 0 && (
                      <div className="mt-2 text-sm text-gray-700 space-y-1">
                        <b>Selected Dates:</b>
                        <ul className="list-disc list-inside">
                        {field.value.map((id) => {
                          const cls = classes.find((c) => c.id === id)
                          return cls ? (
                            <li key={cls.id}><b>{format(parseISO(cls.date), 'PPP')}</b></li>
                          ) : null
                        })}
                        </ul>
                      </div>
                    )}
                  </div>
                )
              }}
            />
      </div>
      <div>
        <label>Name</label>
        <Input {...register('name', { required: true })} />
      </div>

      <div>
        <label>Email</label>
        <Input {...register('email', { required: true })} type="email" />
      </div>
      <div>
        <label>Payment Method</label>
        <Controller
          control={control}
          name="paymentMethod"
          rules={{ required: true }}
          render={({ field }) => (
            <select {...field} className="w-full border rounded p-2">
              <option value="">Select payment</option>
              <option value="ideal">iDeal</option>
              <option value="credit-card">Credit Card</option>
              <option value="paypal">PayPal</option>
            </select>
          )}
        />
      </div>

      <Button type="submit" className="bg-asukamethod text-asukamethod-foreground hover:bg-asukamethod-hover">Book Now</Button>
    </form>
  )
}
