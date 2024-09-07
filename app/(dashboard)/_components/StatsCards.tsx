"use client";
import { getBalanceStatsResponseType } from '@/app/api/stats/balance/route';
import { inter } from '@/lib/fonts';
import { DatetoUTCDate, GetFormatterForCurrency } from '@/lib/helpers';
import { Card } from '@nextui-org/card';
import { UserSettings } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import React, { ReactNode } from 'react'
import CountUp from 'react-countup'
interface props {
    usersettings: UserSettings,
    start: Date,
    end: Date
}

function StatsCards({ usersettings, start, end }: props) {
    const statsQuery = useQuery<getBalanceStatsResponseType>({
        queryKey: ["overview", "stats", start, end],
        queryFn: () => fetch(`/api/stats/balance?start=${DatetoUTCDate(start)}&end=${DatetoUTCDate(end)}`).then(res => res.json())
    })
    const formatter = React.useMemo(() => {
        return GetFormatterForCurrency(usersettings.currency);
    }, [usersettings.currency])

    const income = statsQuery.data?.income || 0
    const expense = statsQuery.data?.expense || 0
    const balance = income - expense
    return (
        <div className='relative flex w-full flex-wrap gap-12 md:flex-nowrap px-3'>
            {/* we can wrap our entire statscard component in a nextui skeleton component which will take the shape by default */}
            <StatsCard
                formatter={formatter}
                value={income}
                title="Income"
                icon={<TrendingUp size={40} strokeWidth={2} className='text-emerald-500 bg-emerald-400/10 rounded-lg p-1' />}
            />
            <StatsCard
                formatter={formatter}
                value={expense}
                title="Expense"
                icon={<TrendingDown size={40} strokeWidth={2} className='text-rose-500 bg-rose-400/10 rounded-lg p-1' />}
            />
            <StatsCard
                formatter={formatter}
                value={balance}
                title="Balance"
                icon={<Wallet size={40} strokeWidth={2} className='text-violet-600 bg-violet-400/10 rounded-lg p-1' />}
            />
        </div>
    )
}
export default StatsCards

function StatsCard({ formatter, value, title, icon }: {
    formatter: Intl.NumberFormat,
    value: number,
    title: string,
    icon: ReactNode
}) {
    const formatFn = React.useCallback((value: number) => {
        return formatter.format(value);
    }, [formatter])
    return (
        <Card className='flex flex-row h-24 w-full p-4 items-center gap-2'>
            {icon}
            <div className='flex flex-col items-start pl-2 gap-0'>
                <p className={`${inter.className} text-foreground-800 text-lg`}>
                    {title}
                </p>
                <CountUp
                    preserveValue
                    redraw={false}
                    end={value}
                    formattingFn={formatFn}
                    decimals={2}
                    className={`${inter.className} text-2xl`}
                    duration={1.500}
                />
            </div>
        </Card>
    )
}
