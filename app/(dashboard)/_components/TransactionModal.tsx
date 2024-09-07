"use client";

import React from "react";
import { TransactionType } from "@/lib/types";
import { ReactNode } from "react";
import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from '@nextui-org/modal'
import { Button } from "@nextui-org/button";
import { Input, Textarea } from "@nextui-org/input";
import { DatePicker } from '@nextui-org/date-picker'
import { DateValue, parseDate } from '@internationalized/date'
import clsx from "clsx";
import { inter, roboto } from "@/lib/fonts";
import { Form, useForm, Controller, SubmitHandler } from "react-hook-form";
import { CreateTransactionSchema, CreateTransactionSchemaType } from "@/schema/TransactionSchema";
import { zodResolver } from '@hookform/resolvers/zod'

import ExpenseSelection from "./ExpenseSelection";

import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateTransaction } from "../_actions/transaction";
import { toast } from "sonner";
import { DatetoUTCDate } from "@/lib/helpers";
interface props {
    type: TransactionType
}

type formdata = z.infer<typeof CreateTransactionSchema>

const formattedDate = new Date().toISOString().split('T')[0];

export default function TransactionModal({ type }: props) {
    // state for date picker
    const [date, setdate] = React.useState<DateValue>(parseDate(formattedDate));

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();


    const { register, handleSubmit, formState: { errors }, control, watch, reset } = useForm<CreateTransactionSchemaType>({
        resolver: zodResolver(CreateTransactionSchema),
        defaultValues: {
            amount: 0,
            description: "",
            //fix this error convert the datepicker value to a js object
            date: new Date(),
            category: "",
            type,
        }
    })
    const formval = watch();
    // const onSubmit: SubmitHandler<formdata> = (data: formdata) => {
    //     console.log(data);
    //     const year = data.date.getUTCFullYear();
    //     const month = String(data.date.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
    //     const day = String(data.date.getUTCDate()).padStart(2, '0');

    //     console.log(`${year}-${month}-${day}`);
    // }

    const queryClient = useQueryClient();
    const { mutate, isPending } = useMutation({
        mutationFn: CreateTransaction,
        onSuccess: () => {
            toast.success("Transaction created successfully 🤩🎉", {
                id: "create-transaction"
            })

            // reset the form inside the modal
            reset();

            // close the modal once transaction is success
            onClose();

            // after submitting the transaction we need to invalidate the query key and make a refetch on the home page
            queryClient.invalidateQueries({
                queryKey: ["overview"]
            })
        }
    })
    const onSubmit = React.useCallback((values: CreateTransactionSchemaType) => {
        toast.loading("Createing Transaction...", {
            id: "create-transaction"
        })
        mutate({
            ...values,
            date: DatetoUTCDate(values.date)
        })
    }, [mutate])

    return (
        <>
            <Button
                variant='bordered'
                color={type === 'income' ? 'success' : 'danger'}
                className={clsx(
                    inter.className,
                    {
                        'hover:bg-emerald-900 hover:text-white': type === 'income',
                        'hover:bg-rose-900 hover:text-white': type === 'expense',
                    }
                )}
                onPress={onOpen}
            >
                {type === 'income' ? 'New Income' : 'New Expense'}
            </Button>
            <Modal
                size="md"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="center"
                backdrop="blur"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className={`${inter.className} flex gap-2`} >
                                Create a new {" "} <span className={clsx(
                                    {
                                        'text-emerald-500': type === "income",
                                        'text-rose-600': type === "expense"
                                    })}>
                                    {type}
                                </span>
                            </ModalHeader>
                            <ModalBody>

                                <form className={`${inter.className} space-y-4`} onSubmit={handleSubmit(onSubmit)}>
                                    <Input size="md" variant="faded" type="number" {...register('amount')} min={1}
                                        label="Enter Amount"
                                        placeholder={'0'}
                                    />
                                    <Textarea size="md" variant="faded" {...register('description')}
                                        label="Enter Description"
                                        placeholder=""
                                    />
                                    {/* MAYBE use a controller here as well , use onchange to set value of controller to the date picker selected date but in different format */}
                                    <Controller
                                        name="date"
                                        control={control}
                                        render={({ field: { onChange } }) => (
                                            <DatePicker label="Select a Date" value={date}
                                                onChange={(newDate) => {
                                                    setdate(newDate)
                                                    onChange(newDate)
                                                }}
                                            />
                                        )}
                                    />
                                    {/* here we will render a select component for type of expense */}
                                    <Controller
                                        name="category"
                                        control={control}
                                        render={({ field }) => (
                                            <ExpenseSelection type={type} {...field} />
                                        )}
                                    />
                                    <p>
                                        {errors.category?.message}
                                    </p>
                                    <div className="flex gap-3">
                                        <Button size="md" variant="ghost" color="primary" type="submit" disabled={isPending} className={clsx({
                                            'cursor-not-allowed': isPending
                                        })}>
                                            Submit {isPending && <>...</>}
                                        </Button>
                                        <Button size="md" variant="ghost" color="default" disabled={isPending} onPress={onClose}>
                                            Cancel
                                        </Button>
                                    </div>

                                </form>
                                <p>
                                    {date.toString()}
                                </p>
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}