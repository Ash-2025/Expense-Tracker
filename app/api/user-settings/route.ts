import prisma from '@/lib/prisma';
import {currentUser} from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
    const user = await currentUser();

    if (!user) {
        // Properly handle redirection
        return Response.redirect("/sign-in");
    }

    let userSettings = await prisma.userSettings.findUnique({
        where: {
            userId: user.id
        }
    });

    if (!userSettings) {
        userSettings = await prisma.userSettings.create({
            data: {
                userId: user.id,
                currency: "USD"
            }
        });
    }

    // Revalidate the home page that uses the user current settings
    revalidatePath("/");

    // Return userSettings as JSON with status code 200
    return new Response(JSON.stringify(userSettings), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}
