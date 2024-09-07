'use client';
import React, { Key, useState } from 'react'
import { inter } from '@/lib/fonts';
import { useMutation, useQuery } from '@tanstack/react-query';
import { UserSettings } from '@prisma/client';
import { currencies, Currency } from '@/lib/data';
import { updateUserCurrency } from '@/app/wizard/_actions/userSettings';
import { toast } from 'sonner';
import { Select, SelectItem } from '@nextui-org/select';

function codeToName(code: String): String {
    const curr = currencies.filter(c => c.code === code)
    return curr[0] ? curr[0].name : "UNKNOWN";
}

export default function SelectCurrency({ label }: { label: string }) {

    const [val, setval] = useState<string>('USD');
    const [option, setSelectedOption] = React.useState<Currency | null>(null)

    // fetch user settings from api located at app/api/user-settings/route.ts using tanstack query
    // here we are using the useQuery hook to fetch data of type userSettings (defined in our prisma schema available in root directory schema folder called prisma)
    // we have defined a query key to quickly locate this fetch in the tanstack dev tools
    const userSettings = useQuery<UserSettings>({
        queryKey: ['userSettings'],
        queryFn: () => fetch('/api/user-settings').then(res => res.json())
    })

    //use effect in case of any change in user settings data like currency updation or a user signs in
    React.useEffect(() => {
        if (!userSettings.data) return;
        const userCurrency = currencies.find(currency => currency.code === userSettings.data.currency)

        if (userCurrency) {
            setval(userCurrency?.code)
            setSelectedOption(userCurrency)
        }
    }, [userSettings.data])

    // here we are using use mutation hook by tanstakc query to update user currency settings
    // we are using server actions here defined in app/wizard/_actions (the server action is validated by zod schema defined in root dir schema folder)
    const mutation = useMutation({
        mutationFn: updateUserCurrency,
        onSuccess: (data: UserSettings) => {
            toast.success(`Currency updated Successfully`, {
                id: 'update-currency'
            })
            setSelectedOption(
                currencies.find(c => c.code === data.currency) || null
            )
        },
        onError: (e) => {
            toast.error(`Something went wrong`, {
                id: 'update-currency'
            })
        }
    })

    const selectOption = React.useCallback((currency: string | null) => {
        if (!currency) {
            // throw a error toast
            toast.error(`Please select a currency`)
            return;
        }
        // throw a success toast
        toast.loading(`Updating currency...`, {
            id: "update-currency",
        })
        mutation.mutate(currency)
        setval(currency)
    }, [mutation])

    // select component handle change
    const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setval(e.target.value);
        selectOption(e.target.value);
    }
    return (
        <>
            {option?.name && <Select
                isRequired
                label={label}
                className={`${inter.className} w-full mr-auto my-2 py-2`}
                size='lg'
                variant='flat'
                disabled={mutation.isPending}
                onChange={handleSelectionChange}
                value={option?.name}
            >
                {
                    currencies.map((cur) => (
                        <SelectItem key={cur.code} className={`${inter.className} text-xl text-green-500`}>
                            {
                                cur.name
                            }
                        </SelectItem>
                    ))
                }
            </Select>
            }
            <span className='text-left ml-3 text-green-500'>
                Your Selected Currency is {option?.name}
            </span>
        </>
    )
}

