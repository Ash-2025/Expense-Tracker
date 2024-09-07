"use client";

import { getTransactionHistoryResponseType } from '@/app/api/transaction-history/route';
import { DatetoUTCDate } from '@/lib/helpers';
import { CalendarDate } from '@internationalized/date';
import { useQuery } from '@tanstack/react-query';

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable
} from '@tanstack/react-table';


import React from 'react'
import { inter, poppins } from '@/lib/fonts';
import clsx from 'clsx';
import { format, parseISO } from 'date-fns';
import { Tooltip } from '@nextui-org/tooltip';

interface props {
    start: CalendarDate, end: CalendarDate
}

type transactionTypeRow = getTransactionHistoryResponseType[0];

export const columns: ColumnDef<transactionTypeRow>[] = [
    {
        accessorKey: "id",
        header: 'ID',
        cell: info => {
            const id = info.getValue() as string
            return <div className='text-sm text-cyan-500'>{id.slice(0, 6)}</div>
        }

    },
    {
        accessorKey: "category",
        header: 'Category'

    },
    {
        accessorKey: "type",
        header: 'Type',
        cell: info => {
            const type = info.getValue() as string;
            return (
                <div className={clsx(
                    {
                        'text-sm text-emerald-500': type === 'income',
                        'text-sm text-rose-600': type === 'expense'
                    }
                )}>
                    {type}
                </div>
            )
        }

    },
    {
        accessorKey: "date",
        header: 'Date',
        cell: info => {
            const val = info.getValue() as string
            let [year, month, date] = val.split('T')[0].split('-')
            return <div className={`text-sm`}>
                {`${date}-${month}-${year}`}
            </div>
        }
    },
    {
        accessorKey: "amount",
        header: 'Amount'

    },
    {
        accessorKey: "description",
        header: 'Description',
        cell: info => {
            const desc = info.getValue() as string;
            return (
                <Tooltip
                    placement='bottom'
                    content={
                        <div className={`${inter.className} text-sm w-[250px] h-auto p-1`}>
                            {desc}
                        </div>
                    }
                >
                    <div className={`${inter.className} text-sm`}>
                        {desc.substring(0, 10)}...
                    </div>
                </Tooltip>
            )
        }
    },

]
const emptyData: any[] = []

function TransactionTable({ start, end }: props) {
    const { year: sy, month: sm, day: sd } = start
    const { year: ey, month: em, day: ed } = end;

    const dateStart = new Date(sy, sm - 1, sd + 1)
    const dateEnd = new Date(ey, em - 1, ed + 1)

    const History = useQuery<getTransactionHistoryResponseType>({
        queryKey: ["transaction", "history", dateStart, dateEnd],
        queryFn: () => fetch(`/api/transaction-history?start=${DatetoUTCDate(dateStart)}&end=${DatetoUTCDate(dateEnd)}`).then(res => res.json()),
    })


    const table = useReactTable({
        data: History.data || emptyData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })
    return (
        <>
            {/* {DatetoUTCDate(dateStart).toString} */}
            <div className="container mx-auto p-4 ">
                {History.isFetched && (
                    <table className="w-full table-auto bg-zinc-900 shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-zinc-800">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id} className="">
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className={`${inter.className} px-4 py-3 text-white font-semibold text-xl text-left`}
                                        >
                                            {flexRender(header.column.columnDef.header, header.getContext())}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>

                        <tbody>
                            {table.getRowModel().rows.length > 0 ? (
                                table.getRowModel().rows.map((row) => (
                                    <tr key={row.id} className="hover:bg-zinc-700">
                                        {row.getVisibleCells().map((cell) => (
                                            <td
                                                key={cell.id}
                                                className={`${inter.className} px-4 py-2 text-white`}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={columns.length} className={`${poppins.className} text-xl font-bold px-4 py-2 text-center text-gray-500 h-20`}>
                                        No rows to display for the selected time period
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}

            </div>
        </>
    )
}

export default TransactionTable
