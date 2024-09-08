import prisma from '@/lib/prisma';
import {currentUser} from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import { z } from 'zod';
export async function GET(request: Request) {
    const user = await currentUser();
    if (!user) redirect("/sign-in");

    const { searchParams } = new URL(request.url);
    const paramsType = searchParams.get('type');

    const validator = z.enum(["income", "expense"]).nullable();
    const queryParams = validator.safeParse(paramsType);

    if (!queryParams.success) {
        // Correct the response handling for errors
        return new Response(JSON.stringify({ error: queryParams.error }), {
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

    // Correctly return the categories in the JSON response
    return new Response(JSON.stringify(categories), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}
