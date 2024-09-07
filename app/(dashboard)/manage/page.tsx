'use client';
import SelectCurrency from '@/components/SelectCurrency';
import { roboto } from '@/lib/fonts';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import React from 'react'

function Manage() {
    return (
        <>
            <div className=''>
                <div className="container mx-auto flex flex-wrap items-center justify-between gap-6 py-8 px-3">
                    <p className={`${roboto.className} text-3xl font-bold`}>
                        Manage
                    </p>
                    <p className={`${roboto.className} text-foreground-700`}>
                        Manage your account settings and categories
                    </p>
                </div>
            </div>

            <div className='container mx-auto flex flex-col gap-4 p-4'>
                <Card>
                    <CardHeader className={`${roboto.className} text-xl text-foreground-500 flex flex-col items-start`}>
                        Currency
                        <p className={`text-md text-foreground-700`}>
                            set your default currency for transactions
                        </p>
                    </CardHeader>
                    <CardBody>
                        <SelectCurrency label='Change Currency' />
                    </CardBody>
                </Card>
            </div>
        </>
    )
}

export default Manage