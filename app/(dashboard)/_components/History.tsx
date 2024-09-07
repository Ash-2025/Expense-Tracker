"use client";
import { inter, poppins } from '@/lib/fonts';
import { GetFormatterForCurrency } from '@/lib/helpers';
import { TimeFrame, period } from '@/lib/types';
import { Card, CardHeader, CardBody } from '@nextui-org/card';
import { UserSettings } from '@prisma/client';
import React from 'react'
import HistoryPeriodSelector from './HistoryPeriodSelector';
import { useQuery } from '@tanstack/react-query';

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { getHistoryDataResponseType } from '@/app/api/history-data/route';
import { Tooltip } from '@nextui-org/tooltip';

function History({ usersettings }: { usersettings: UserSettings }) {
  const [Timeframe, setTimeframe] = React.useState<TimeFrame>("month");
  const [period, setPeriod] = React.useState<period>({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  })

  const formatter = React.useMemo(() => {
    return GetFormatterForCurrency(usersettings.currency)
  }, [usersettings.currency])


  const historyDataQuery = useQuery<getHistoryDataResponseType>({
    queryKey: ["overview", "history", Timeframe, period],
    queryFn: () => fetch(`/api/history-data?timeframe=${Timeframe}&year=${period.year}&month=${period.month}`).then(res => res.json())
  })

  const dataAvailable = historyDataQuery.data && historyDataQuery.data.length > 0
  return (
    <div className='container mx-auto px-3 hidden md:block'>
      <h2 className={`${poppins.className} mt-12 text-3xl font-bold`}>
        History {Timeframe}
      </h2>
      <Card className='col-span-12 mt-2 w-full mb-3'>
        <CardHeader className='w-full grid grid-flow-row items-center justify-between gap-2 md:grid-flow-col'>
          <HistoryPeriodSelector
            period={period}
            setPeriod={setPeriod}
            timeframe={Timeframe}
            setTimeframe={setTimeframe}
          />
          <div className="flex h-10 gap-4">
            <div className={`${inter.className} flex items-center gap-2 text-sm`}>
              <div className='h-8 w-8 bg-emerald-600 rounded-full' />
              Income
            </div>
            <div className={`${inter.className} flex items-center gap-2 text-sm`}>
              <div className='h-8 w-8 bg-red-600 rounded-full' />
              Expense
            </div>

          </div>
        </CardHeader>
        {/* add skeleton and wrap cardbody inside it */}
        {
          dataAvailable && (
            <ResponsiveContainer width={'100%'} height={400}>
              <BarChart height={300} data={historyDataQuery.data} barCategoryGap={5}>
                <defs>
                  <linearGradient id='incomeBar' x1='0' y1='0' x2='0' y2='1'>
                    <stop
                      offset={'0'}
                      stopColor='#10b981'
                      stopOpacity={'1'}
                    />
                    <stop
                      offset={'1'}
                      stopColor='#10b981'
                      stopOpacity={'0'}
                    />
                  </linearGradient>

                  <linearGradient id='expenseBar' x1='0' y1='0' x2='0' y2='1'>
                    <stop
                      offset={'0'}
                      stopColor='#ef4444'
                      stopOpacity={'1'}
                    />
                    <stop
                      offset={'1'}
                      stopColor='#ef4444'
                      stopOpacity={'0'}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="5 5" strokeOpacity={0.2} vertical={false} />
                <XAxis
                  stroke='#888888'
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  padding={{ left: 5, right: 5 }}
                  dataKey={(data) => {
                    const { year, month, day } = data
                    const date = new Date(year, month - 1, day || 1)
                    if (Timeframe === "year") {
                      return date.toLocaleDateString("default", {
                        month: "long"
                      })
                    }
                    return date.toLocaleDateString("default", {
                      day: "numeric"
                    })
                  }}
                />

                <YAxis
                  stroke='#888888'
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                {/* add tooltip */}
                <Bar
                  dataKey={"income"}
                  label={"Income"}
                  fill='url(#incomeBar)'
                  radius={4}
                  className='cursor-pointer'
                />
                <Bar
                  dataKey={"expense"}
                  label={"Expense"}
                  fill='url(#expenseBar)'
                  radius={4}
                  className='cursor-pointer'
                />

              </BarChart>
            </ResponsiveContainer>
          )
        }
        {
          !dataAvailable && <CardBody className={`${inter.className} flex h-[400px] flex-col items-center justify-center text-xl`}>
            No data for the selected Card
            <p className={`${inter.className} hidden md:block text-sm text-foreground-800`}>
              Try selecting a different period or add some new transactions
            </p>
          </CardBody>
        }

      </Card>
    </div>
  )
}

export default History