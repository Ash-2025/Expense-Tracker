"use client";

import React from 'react'
import { getHistoryPeriodsResponseType } from '@/app/api/history-periods/route';
import { inter } from '@/lib/fonts';
import { period, TimeFrame } from '@/lib/types';
import { Select, SelectItem } from '@nextui-org/select';
import { Tab, Tabs } from '@nextui-org/tabs';
import { useQuery } from '@tanstack/react-query';
import { CalendarSearch } from 'lucide-react';

interface props {
  period: period,
  setPeriod: (period: period) => void;
  timeframe: TimeFrame
  setTimeframe: (timeframe: TimeFrame) => void;
}

function HistoryPeriodSelector({ period, setPeriod, timeframe, setTimeframe }: props) {

  const historyPeriod = useQuery<getHistoryPeriodsResponseType>({
    queryKey: ["overview", "history", "periods"],
    queryFn: () => fetch(`api/history-periods`).then(res => res.json())
  })

  const [selected, setSelected] = React.useState("Year");
  const handleSelectionChange = (key: React.Key) => {
    if (typeof key === 'string') {
      setSelected(key);

      //CHANGE THE TIMEFRAME STATE HERE
      setTimeframe(key as TimeFrame)
      console.log(timeframe);
    }
  };
  return (
    <div className='w-full flex flex-col items-start sm:flex-row sm:items-center gap-4'>
      {/* wrap these component in skeleton wrapper */}
      <Tabs selectedKey={selected} onSelectionChange={handleSelectionChange}
        className={`${inter.className}`}
        size="lg"
        color="warning"
        variant='bordered'
        aria-label='tab'
      >
        <Tab key="year" title="Year" >
          <div className="flex flex-col items-start sm:flex-row sm:items-center gap-2">
            {/* wrap this children in skeleton wrapper */}
            <YearSelector
              period={period}
              setPeriod={setPeriod}
              years={historyPeriod.data || []}
            />
          </div>
        </Tab>
        <Tab key="month" title="Month" >
          <div className="flex flex-col items-start sm:flex-row sm:items-center gap-2">
            {/* wrap this children in skeleton wrapper */}
            <YearSelector
              period={period}
              setPeriod={setPeriod}
              years={historyPeriod.data || []}
            />
            <MonthSelector
              period={period}
              setPeriod={setPeriod}
            />
          </div>
        </Tab>
      </Tabs>


    </div>
  )
}

export default HistoryPeriodSelector

function YearSelector({ period, setPeriod, years }: {
  period: period
  setPeriod: (period: period) => void
  years: getHistoryPeriodsResponseType
}) {
  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPeriod({
      month: period.month,
      year: parseInt(e.target.value)
    })
  }
  return (
    <Select
      placeholder="Select year"
      variant='bordered'
      size="lg"
      className={`${inter.className} w-[150px] text-lg text-foreground-700`}
      value={period.year}
      onChange={handleSelectionChange}
      startContent={<CalendarSearch size={30} />}
      aria-label='yearselect'
      defaultSelectedKeys={[`${period.year}`]}
    >
      {years.map(year => (
        <SelectItem
          className={`${inter.className} text-xl`}
          key={year}
        >
          {year.toString()}
        </SelectItem>
      ))}
    </Select>
  )
}

function MonthSelector({ period, setPeriod }: {
  period: period
  setPeriod: (period: period) => void
}) {
  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPeriod({
      month: parseInt(e.target.value) - 1,
      year: period.year
    })
  }
  return (
    <Select
      placeholder="Select a Month"
      variant='bordered'
      size="lg"
      className={`${inter.className} w-[180px] text-lg text-foreground-700`}
      value={period.month}
      onChange={handleSelectionChange}
      startContent={<CalendarSearch size={30} />}
      aria-label='monthselect'
      defaultSelectedKeys={[`${period.month}`]}
    >
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month => {
        const monthStr = new Date(period.year, month - 1, 1).toLocaleString("default", {
          month: "long",
        });
        return (
          <SelectItem
            className={`${inter.className} text-xl`}
            key={month}
          >
            {monthStr}
          </SelectItem>
        );
      })}
    </Select>
  )
}