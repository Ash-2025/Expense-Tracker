import prisma from "@/lib/prisma";
import { OverviewQuerySchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
    const user = await currentUser();
    if (!user) {
        // Properly handle redirection
        return Response.redirect("/sign-in");
    }

    const { searchParams } = new URL(request.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    const queryParams = OverviewQuerySchema.safeParse({ start, end });
    if (!queryParams.success) {
        // Throw an error with a proper response
        return new Response(JSON.stringify({ error: queryParams.error.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const stats = await getCategoryStats(
        user.id,
        queryParams.data.start,
        queryParams.data.end
    );

    // Return the stats as a JSON response
    return new Response(JSON.stringify(stats), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
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