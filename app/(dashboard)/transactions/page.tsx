"use client";

import { inter, poppins } from '@/lib/fonts';
import { CalendarDate, DateValue, parseDate } from '@internationalized/date';
import { DatePicker, DateRangePicker } from '@nextui-org/date-picker';
import { RangeValue } from '@nextui-org/calendar';
import React from 'react'
import TransactionTable from './_components/TransactionTable';

function page() {
  const formattedDate = new Date().toISOString().split('T')[0];
  const dates: RangeValue<CalendarDate> = {
    start: parseDate(formattedDate),
    end: parseDate(formattedDate)
  }
  const [dateRange, setdateRange] = React.useState<RangeValue<CalendarDate>>(dates)
  return (
    <>
      <div className="border-b-foreground-100">
        <div className='container mx-auto flex flex-wrap items-center justify-between gap-6 py-8 px-4'>
          <div>
            <p className={`${poppins.className} text-3xl font-bold`}>
              Transaction History
            </p>
          </div>
          <DateRangePicker
            variant='bordered'
            size='md'
            className={`${inter.className} max-w-sm`}
            label="Select a date range"
            description="Date range (MM/DD/YYYY) Format"
            value={dateRange}
            onChange={setdateRange}

          />
        </div>
      </div>

      <div className='container mx-auto'>
        <TransactionTable start={dateRange.start} end={dateRange.end} />
      </div>
    </>
  )
}

export default page