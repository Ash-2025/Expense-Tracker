'use server';
import React from 'react'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { inter, poppins } from '@/lib/fonts';
import { Button } from '@nextui-org/button';
import TransactionModal from './_components/TransactionModal';
import Overview from './_components/Overview';
import History from './_components/History';
export default async function page() {
  const user = await currentUser();
  if (!user) redirect("/sign-in")

  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id
    }
  })
  if (!userSettings) {
    redirect("/wizard")
  }
  return (
    <div className='w-full'>
      <div className='bg-background'>
        <div className="container mx-auto flex flex-wrap items-center justify-between px-3 py-8 gap-4">
          <p className={`${poppins.className} text-3xl font-bold`}>
            Hello, {user.firstName}!
          </p>

          <div className={`flex items-center gap-3`}>
            {/* create a custom client component button with the modal logic and render the buttons here this way you will be able to use nextui modal component 
              a custom button component will allow you to use state and it can still be rendered in the server side */}

            <TransactionModal type='income' />
            <TransactionModal type='expense' />
          </div>
        </div>
      </div>

      <Overview usersettings={userSettings} />
      <History usersettings={userSettings} />
    </div>
  )
}
