"use client";

import React from 'react';
import { expenseCategories, incomeCategories } from '@/lib/data';
import { inter, roboto } from '@/lib/fonts'
import { TransactionType } from '@/lib/types'
import { Autocomplete, AutocompleteItem } from '@nextui-org/autocomplete';
import { useQuery } from '@tanstack/react-query';
import { Key } from '@react-types/shared'
import { ControllerRenderProps } from 'react-hook-form';
import { Category } from '@prisma/client';

interface Props extends ControllerRenderProps {
    type: TransactionType
}

const ExpenseSelection = React.forwardRef(({ type, onChange }: Props, ref) => {
    const categoriesQuery = useQuery<Category>({
        queryKey: ["categories", type],
        queryFn: () => fetch(`/api/categories?type=${type}`).then(res => res.json())
    })

    {/* instead of creating a new category picker component we can use the autocomplete component with allow custom values from nextui with react hook form control to get its value */ }

    // feature is successfully implemented using controllerRenderProps and attaching a form ref to the autocomplete component
    // this will help us use onChange function to update the form tracker value for this specific field
    const [open, setopen] = React.useState(false);
    const [Val, setVal] = React.useState<Key | undefined | null>('');
    const [customVal, setcustomVal] = React.useState<string | null>('');
    const fieldchange = (Value: string) => {
        setcustomVal(Value)
        onChange(Value);
    }
    return (
        <>
            <Autocomplete
                ref={ref as React.Ref<HTMLInputElement>}
                allowsCustomValue={true}
                isRequired
                label="Select a Category"
                defaultItems={type === "income" ? incomeCategories : expenseCategories}
                size='md'
                variant='flat'
                placeholder='Add a new category if you cant find it'
                onOpenChange={setopen}
                onInputChange={fieldchange}
                selectedKey={Val}
                onSelectionChange={(key) => {
                    if (key !== null) {
                        const selectedValue = String(key);
                        setVal(key);
                        setcustomVal(selectedValue);
                        onChange(selectedValue); // Update the form field with the selected value
                    } else {
                        setVal(null);
                        setcustomVal(null);
                    }
                }}

            >
                {
                    type === "income" ?
                        (
                            incomeCategories.map(item => (
                                <AutocompleteItem key={item.name} className={`${inter.className} text-emerald-600`}>
                                    {item.name}
                                </AutocompleteItem>
                            ))
                        ) :
                        (
                            expenseCategories.map(item => (
                                <AutocompleteItem key={item.name} className={`${inter.className} text-rose-600`}>
                                    {item.name}
                                </AutocompleteItem>
                            ))
                        )
                }
            </Autocomplete>

        </>
    )
})

export default ExpenseSelection