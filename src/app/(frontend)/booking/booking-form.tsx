'use client'

import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { format, parseISO, isSameDay } from 'date-fns'
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
  classTitle?: string
}

export const BookingForm = () => {
  const { handleSubmit, control, register, setValue, watch, formState: { errors } } = useForm<BookingFormInputs>()

  const [classes, setClasses] = useState<OnlineClass[]>([])
  const [selectedDays, setSelectedDays] = useState<Date[]>([])
  const router = useRouter()

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
    router.push('/thank-you')  // redirect after success
  }  
  
  // classes per selected day
  const classOptionsForSelectedDays = selectedDays.flatMap((day) =>
    classes.filter((cls) =>
      isSameDay(parseISO(cls.date), day)
    )
  )

  const selectedClassIds = watch('selectedDates') || []

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mb-6">
        {/* Date Picker & Class Options */}
        <div className="flex flex-col gap-6">
          {/* Date Picker Section */}
          <div>
            <h2 className="text-lg font-semibold mb-2">1. Choose class date(s)</h2>
            <div className="booking-theme">
              <DayPicker
                mode="multiple"
                selected={selectedDays}
                onSelect={(days) => {
                  if (!days) return
                  const newSelected = Array.isArray(days) ? days : [days]
                  setSelectedDays(newSelected)

                  const validClassIds = classes
                    .filter(cls =>
                      newSelected.some(day =>
                        isSameDay(parseISO(cls.date), day)
                      )
                    )
                    .map(c => c.id)

                  const filteredSelected = selectedClassIds.filter(id =>
                    validClassIds.includes(id)
                  )
                  setValue('selectedDates', filteredSelected)
                }}
                disabled={(date) =>
                  !classes.some(cls => isSameDay(parseISO(cls.date), date))
                }
              />
            </div>
          </div>

          {/* Class Time Options */}
          {selectedDays.length > 0 && (
            <div className="space-y-4 border-t border-border pt-4">
              <h2 className="text-lg font-semibold mb-2">2. Select class times</h2>
              {selectedDays
                .slice()
                .sort((a, b) => a.getTime() - b.getTime())
                .map((day) => {
                  const dayClasses = classes.filter(cls =>
                    isSameDay(parseISO(cls.date), day)
                  )
                  if (dayClasses.length === 0) return null
                  return (
                    <div key={day.toISOString()} className="selected-date">
                      <h3 className="font-medium">{format(day, 'PPPP')}:</h3>
                      <ul className="space-y-1 ml-4">
                        {dayClasses
                          .sort(
                            (a, b) =>
                              parseISO(a.date).getTime() -
                              parseISO(b.date).getTime()
                          )
                          .map((cls) => (
                            <li key={cls.id}>
                              <label className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  value={cls.id}
                                  checked={selectedClassIds.includes(cls.id)}
                                  onChange={(e) => {
                                    const newIds = e.target.checked
                                      ? [...selectedClassIds, cls.id]
                                      : selectedClassIds.filter((id) => id !== cls.id)
                                    setValue('selectedDates', newIds, {
                                      shouldValidate: true,
                                    })
                                  }}
                                />
                                {format(parseISO(cls.date), 'HH:mm')} —{' '}
                                {cls.classTitle?.trim() || (
                                  <span className="italic text-gray-500">
                                    Untitled Class
                                  </span>
                                )}
                              </label>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )
                })}

              {/* Validation error */}
              <input
                type="hidden"
                {...register('selectedDates', {
                  validate: value =>
                    (value && value.length > 0) ||
                    'Please select at least one class.',
                })}
              />
              {errors.selectedDates && (
                <p className="text-red-500 text-sm">
                  {errors.selectedDates.message}
                </p>
              )}
            </div>
          )}
        </div>

        {/* The rest of your form fields below remain unchanged */}
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
              <select
                {...field}
                className="w-full border rounded p-2 bg-background text-foreground border-border
                focus:outline-none focus:ring-2 focus:ring-asukamethod-hover"
              >
                <option value="">Select payment</option>
                <option value="stripe">Credit Card / iDeal</option>
                <option value="paypal">PayPal</option>
              </select>
            )}
          />
        </div>

        <Button
          type="submit"
          className="bg-asukamethod text-asukamethod-foreground hover:bg-asukamethod-hover"
        >
          Book Now
        </Button>
      </form>
    </div>
  )
}
