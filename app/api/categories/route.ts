import prisma from '@/lib/prisma';
import {currentUser} from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import { z } from 'zod';
export async function GET(request: Request) {
    const user = await currentUser();
    if (!user) {
        // Properly handle redirection
        return Response.redirect("/sign-in");
    }

    const { searchParams } = new URL(request.url);
    const paramsType = searchParams.get('type');

    const validator = z.enum(["income", "expense"]).nullable();
    const queryParams = validator.safeParse(paramsType);

    if (!queryParams.success) {
        // Return JSON with error message and status code 400
        return new Response(JSON.stringify({ error: queryParams.error.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const type = queryParams.data;
    const categories = await prisma.category.findMany({
        where: {
            userId: user.id,
            ...(type && { type }), // include type in the filters if it's defined
        },
        orderBy: {
            name: "asc"
        }
    });

    // Return categories as JSON with status code 200
    return new Response(JSON.stringify(categories), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}
