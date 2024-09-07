import { GetFormatterForCurrency } from "@/lib/helpers";
import prisma from "@/lib/prisma";
import { OverviewQuerySchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET(request: Request){
    const user = await currentUser();
    if(!user) redirect("/sign-in")

    const {searchParams} = new URL(request.url)
    const start = searchParams.get("start")
    const end = searchParams.get("end")

    const queryParams = OverviewQuerySchema.safeParse({
        start,end
    })
    if(!queryParams.success){
        return Response.json(queryParams.error.message, {
            status: 400
        })
    }

    const transactions = await getTransactionHistory(user.id,queryParams.data.start,queryParams.data.end)

    return Response.json(transactions);
}

export type getTransactionHistoryResponseType = Awaited<ReturnType<typeof getTransactionHistory>>

async function getTransactionHistory(userId:string,start:Date,end:Date){
    const userSettings = await prisma.userSettings.findUnique({
        where:{
            userId
        }
    })
    if(!userSettings) {
        throw new Error(`User ${userId} does not exist`)
    }
    const formatter = GetFormatterForCurrency(userSettings.currency)

    const transactions = await prisma.transaction.findMany({
        where:{
            userId,
            date:{
                gte:start,
                lte:end
            }
        },
        orderBy:{
            date:"desc"
        }
    })
    
    return transactions.map(transaction => ({
        ...transaction,
        formattedAmount:formatter.format(transaction.amount)
    }))
}