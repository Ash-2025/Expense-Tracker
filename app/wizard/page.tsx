import React from 'react'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { inter, poppins, roboto } from '@/lib/fonts'
import { Divider } from '@nextui-org/divider'
import { Card, CardHeader, CardBody } from '@nextui-org/card'
import {Button} from '@nextui-org/button'
import Link from 'next/link'
import SelectCurrency from '@/components/SelectCurrency'
import Logo from '@/components/Logo'
async function page() {
    const user = await currentUser();
    if (!user) {
        redirect("/sign-in")
    }
    return (
        <div className='container mx-auto flex max-w-2xl flex-col items-center justify-between gap-4'>
            <Logo/>
            <div>
                <h1 className={`${poppins.className} text-center text-3xl`}>
                    Welcome, <span className={`${poppins.className} ml-2 font-bold`}>{user.firstName}!</span>
                </h1>
                <h2 className={`${roboto.className} mt-4 text-center text-base text-foreground`}>
                    Let &apos;s get started by setting up your currency
                </h2>
                <h3 className={`${inter.className}  mt-4 text-center text-sm text-foreground`}>
                    You can change this setting at any time
                </h3>
            </div>
            <Divider orientation='horizontal' className='w-5/6 mx-auto sm:w-full' />

            <Card className={`${roboto.className} w-5/6 mx-auto p-2`}>
                <CardHeader className='text-xl'>Currency</CardHeader>
                <CardBody className='text-lg'>
                    <p>Set your default currency for transactions</p>
                </CardBody>
                <SelectCurrency label='Select or change currency'/>
            </Card>
            <Divider orientation='horizontal' className='w-5/6 mx-auto sm:w-full' />

            <Button variant='light' size='md' radius="md" color='success' className={`${inter.className} text-lg w-5/6 md:w-full h-auto text-wrap mx-auto border-1 border-green-600 flex items-center justify-center sm:px-2 sm:py-2`}>
                <Link href={"/"}>
                    I'm Done take me back to the dashboard
                </Link>
            </Button>
        </div>
    )
}

export default page