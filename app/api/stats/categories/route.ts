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

    const queryParams = OverviewQuerySchema.safeParse({start, end});
    if(!queryParams.success){
        throw new Error(queryParams.error.message)
    }
    const stats = await getCategoryStats(
        user.id,
        queryParams.data.start,
        queryParams.data.end
    )
    return Response.json(stats);
}

export type getCategoryStatsResponseType = Awaited<ReturnType<typeof getCategoryStats>>
async function getCategoryStats(userId: string, start:Date, end:Date){
    const stats = await prisma.transaction.groupBy({
        by:["type","category"],
        where:{
            userId,
            date:{
                gte:start,
                lte:end
            }
        },
        _sum:{
            amount:true,
        },
        orderBy:{
            _sum:{
                amount:"desc"
            }
        }
    })
    return stats;
}