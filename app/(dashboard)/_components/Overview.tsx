"use client";
import { inter, poppins } from '@/lib/fonts';
import { CalendarDate, parseDate, toTimeZone } from '@internationalized/date';
import { RangeValue } from '@nextui-org/calendar';
import { DateRangePicker } from '@nextui-org/date-picker'
import { UserSettings } from '@prisma/client'
import React from 'react'
import StatsCards from './StatsCards';
import CategoryStats from './CategoryStats';

const formattedDate = new Date().toISOString().split('T')[0];

// const nextDate = new Date(Date.now() + 86400000);
// const nextFormattedDate = nextDate.toISOString().split('T')[0];


const dates: RangeValue<CalendarDate> = {
    start: parseDate(formattedDate),
    end: parseDate(formattedDate)
}
function Overview({ usersettings }: { usersettings: UserSettings }) {
    const [dateRange, setdateRange] = React.useState<RangeValue<CalendarDate>>(dates);
    return (
        <>
            <div className='flex flex-col gap-2'>
            </div>
            <div className="container mx-auto flex flex-wrap items-start justify-between gap-2 py-6 px-3">
                <h2 className={`${poppins.className} text-3xl font-bold`}>
                    Overview
                </h2>
                <div className="flex items-center gap-3">
                    {/* add the date range picker component */}
                    <DateRangePicker
                        variant='bordered'
                        size='md'
                        className={`${inter.className}`}
                        label="Select a date range"
                        description="Date range (MM/DD/YYYY) Format"
                        value={dateRange}
                        onChange={setdateRange}
                    />
                </div>
            </div>

            <div className="container mx-auto w-full flex flex-col gap-2">
                <StatsCards
                    usersettings={usersettings}
                    start={dateRange.start.toDate('UTC')}
                    end={dateRange.end.toDate('UTC')}
                />

                <CategoryStats
                    usersettings={usersettings}
                    start={dateRange.start.toDate('UTC')}
                    end={dateRange.end.toDate('UTC')}
                />
            </div>


        </>
    )
}

export default Overview