'use server';

import prisma from '@/lib/prisma';
import {updateUserCurrencySchema} from '@/schema/userSettings'
import {currentUser} from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';

export async function updateUserCurrency(currency: string){
    const parsedbody = updateUserCurrencySchema.safeParse({
        currency
    })
    if(!parsedbody.success){
        throw parsedbody.error;
    }
    const user = await currentUser();
    if(!user) redirect('/sign-in');
    
    const userSettings = await prisma.userSettings.update({
        where:{
            userId: user.id,
        },
        data:{
            currency
        }
    })
    return userSettings
}