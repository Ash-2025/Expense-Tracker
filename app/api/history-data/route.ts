import prisma from '@/lib/prisma';
import { period, TimeFrame } from '@/lib/types';
import { currentUser } from '@clerk/nextjs/server'
import { getDaysInMonth } from 'date-fns';
import { redirect } from 'next/navigation';
import { z } from 'zod'

const getHistoryDataSchema = z.object({
    timeframe: z.enum(["month", "year"]),
    month: z.coerce.number().min(0).max(12).default(0),
    year: z.coerce.number().min(2023).max(2033)
})
export async function GET(request: Request) {
    const user = await currentUser();
    if (!user) {
        // Properly handle redirection
        return Response.redirect("/sign-in");
    }

    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get("timeframe");
    const year = searchParams.get("year");
    const month = searchParams.get("month");

    const queryParams = getHistoryDataSchema.safeParse({
        timeframe,
        year,
        month,
    });

    if (!queryParams.success) {
        // Return a valid response with error message
        return new Response(JSON.stringify({ error: queryParams.error.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const data = await getHistoryData(user.id, queryParams.data.timeframe, {
        month: queryParams.data.month,
        year: queryParams.data.year,
    });

    // Return a valid JSON response
    return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}


export type getHistoryDataResponseType = Awaited<ReturnType<typeof getHistoryData>>

async function getHistoryData(
    userid: string,
    timeframe: TimeFrame,
    period: period
) {
    switch (timeframe) {
        case "year":
            return await getHistoryYearData(userid, period.year)
        case "month":
            console.log(``)
            return await getHistoryMonthData(userid,period.year,period.month)
    }
}
type HistoryData = {
    expense: number,
    income: number,
    year: number,
    month: number,
    day?: number
}
async function getHistoryYearData(userId: string, year: number) {
    const result = await prisma.yearHistory.groupBy({
        by: ["month"],
        where: {
            userId,
            year
        },
        _sum: {
            expense: true,
            income: true,
        },
        orderBy: [
            {
                month: "asc"
            }
        ]
    })
    if (!result || result.length === 0) return [];

    /* 

    */
    const history: HistoryData[] = [];
    for (let i = 1; i <= 12; i++) {
        let expense = 0, income = 0;

        const month = result.find(row => row.month === i);
        if (month) {
            expense = month._sum.expense || 0
            income = month._sum.income || 0
        }
        history.push({
            year,
            month: i,
            expense,
            income
        })
    }
    return history;
}

async function getHistoryMonthData(userId: string, year: number, month: number) {
    const result = await prisma.monthHistory.groupBy({
        by: ["day"],
        where: {
            userId,
            year,
            month
        },
        _sum: {
            expense: true,
            income: true
        },
        orderBy: [{
            day: "asc"
        }]
    })
    if (!result || result.length === 0) {
        return [];
    }
    const history:HistoryData[] = [];

    // here we have a month index mismatch so figure it out
    const daysInMonth = getDaysInMonth(new Date(year,month-1));

    for(let i = 1; i <= daysInMonth; i++){
        let income=0,expense=0;
        const day = result.find(row=> row.day===i);
        if(day){
            expense = day._sum.expense || 0
            income = day._sum.income || 0
        }
        history.push({
            expense,
            income,
            year,
            month,
            day:i
        })
    }
    return history;
}