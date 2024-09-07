"use client";

import { getCategoryStatsResponseType } from '@/app/api/stats/categories/route';
import { inter, roboto } from '@/lib/fonts';
import { DatetoUTCDate, GetFormatterForCurrency } from '@/lib/helpers';
import { TransactionType } from '@/lib/types';
import { Card, CardHeader } from '@nextui-org/card';
import {Progress} from '@nextui-org/progress'
import { UserSettings } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import React from 'react'
interface props {
    usersettings: UserSettings,
    start: Date,
    end: Date
}
function CategoryStats({ usersettings, start, end }: props) {
    const statsQuery = useQuery<getCategoryStatsResponseType>({
        queryKey: ["overview", "stats", "categories", start, end],
        queryFn: () => fetch(`/api/stats/categories?start=${DatetoUTCDate(start)}&end=${DatetoUTCDate(end)}`).then(res => res.json())
    })

    const formatter = React.useMemo(() => {
        return GetFormatterForCurrency(usersettings.currency)
    }, [usersettings.currency])
    return (
        <div className='flex w-full flex-wrap gap-2 md:flex-nowrap'>
            {/* wrap this in skeleton */}
            <CategoryCard
                formatter={formatter}
                type='income'
                data={statsQuery.data || []}
            />
            <CategoryCard
                formatter={formatter}
                type='expense'
                data={statsQuery.data || []}
            />
        </div>
    )
}

export default CategoryStats

function CategoryCard({ data, type, formatter }: {
    type: TransactionType,
    data: getCategoryStatsResponseType,
    formatter: Intl.NumberFormat
}) {
    const filteredData = data.filter((el) => el.type === type)
    const total = filteredData.reduce((acc, el) => acc + (el._sum?.amount || 0), 0)
    return (
        // wrap this in a skeleton
        <Card className='h-80 w-full col-span-6 mx-3 my-3'>
            <CardHeader className={`${roboto.className} grid grid-flow-row justify-between gap-2 md:grid-flow-col text-xl`}>
                {type==="income" ? "Incomes":"Expenses"} by Category
            </CardHeader>

            <div className="flex items-center justify-between gap-2">
                {filteredData.length === 0 && (
                    <div className={`${inter.className} flex h-60 w-full flex-col items-center justify-center text-xl`}>
                        No Data for the selected period
                        <p className='text-sm text-foreground-800 text-center'>
                            {`Try selecting a different period or try adding a new ${type}s`}
                        </p>
                    </div>
                )}
                {filteredData.length > 0 && (
                    <div className="h-60 w-full px-4 overflow-y-auto">
                        <div className="flex w-full flex-col gap-4 p-4">
                            {filteredData.map((item) => {
                                const amount = item._sum.amount || 0;
                                const percentage = (amount * 100)/(total || amount);
                                return (
                                    <div className='flex flex-col gap-2'>
                                        <div className='flex items-center justify-between'>
                                            <span className={`${inter.className} flex items-center text-foreground-800 text-lg`}>
                                                {item.category}

                                                <span className='ml-2 text-sm text-foreground-800'>
                                                    ({percentage.toFixed(0)}%)
                                                </span>
                                            </span>
                                            <span className={`${inter.className} text-sm text-foreground-800`}>
                                                {formatter.format(amount)}
                                            </span>
                                        </div>
                                        {/* progress bar display */}
                                        <Progress
                                            size='sm'
                                            value={percentage}
                                            classNames={{
                                                indicator:type==="income"? 'bg-emerald-500':'bg-rose-700'
                                            }}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    )
}