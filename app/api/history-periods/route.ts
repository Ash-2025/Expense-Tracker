import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
    const user = await currentUser();
    if (!user) {
        // Properly handle redirection
        return Response.redirect("/sign-in");
    }

    const periods = await getHistoryPeriods(user.id);

    // Return a valid JSON response
    return new Response(JSON.stringify(periods), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}


export type getHistoryPeriodsResponseType = Awaited<ReturnType<typeof getHistoryPeriods>>
async function getHistoryPeriods(userId: string){
    const results = await prisma.monthHistory.findMany({
        where:{
            userId
        },
        select:{
            year:true
        },
        distinct:["year"],
        orderBy:{
            year:"asc"
        }
    })
    const years = results.map(el => el.year);
    if(years.length === 0){
        return [new Date().getFullYear()]
    }
    return years;
}