// src/components/ui/calendar.tsx
'use client'

import * as React from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

type CalendarProps = {
  selected?: Date
  onSelect?: (date: Date | undefined) => void
}

export function Calendar({ selected, onSelect }: CalendarProps) {
  return (
    <DayPicker
      mode="single"
      selected={selected}
      onSelect={onSelect}
      footer={selected ? `You selected ${selected.toLocaleDateString()}` : 'Please pick a day.'}
    />
  )
}
