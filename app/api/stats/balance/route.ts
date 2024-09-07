import prisma from "@/lib/prisma";
import { OverviewQuerySchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET(request:Request){
    const user = await currentUser();
    if(!user){
        redirect("/sign-in");
    }
    const {searchParams} = new URL(request.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    const queryParams = OverviewQuerySchema.safeParse({start,end});
    if(!queryParams.success){
        return Response.json(queryParams.error.message, {
            status:400
        })
    }
    // using a helper function to fetch data from db using prisma 
    const stats = await getBalanceStats(
        user.id,
        queryParams.data.start,
        queryParams.data.end
    );
    return Response.json(stats);
}

//exporting getBalanceStats function as a type to use it further while making type safe queries
export type getBalanceStatsResponseType = Awaited<ReturnType<typeof getBalanceStats>>;

async function getBalanceStats(userId:string, start:Date, end:Date){
    const totals = prisma.transaction.groupBy({
        by:["type"],
        where:{
            userId,
            date:{
                gte:start,
                lte:end
            }
        },
        _sum:{
            amount:true
        }
    })
    return {
        expense : (await totals).find(t => t.type === "expense")?._sum.amount || 0,
        income : (await totals).find(t => t.type === "income")?._sum.amount || 0
    }
}