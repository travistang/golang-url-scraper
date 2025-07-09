"use client"

import {
    RowSelectionState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from "@tanstack/react-table"
import * as React from "react"

import { Pagination } from "@/components/pagination"
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { useBulkTaskAction } from "../../hooks/use-bulk-task-action"
import { Task, TaskSearchParams } from "../../types"
import { BulkActionButtonGroup } from "./bulk-action-button-group"
import { SearchBar } from "./search-bar"
import { createTaskColumns } from "./task-table-column/task-columns"
import { TaskTableRows } from "./task-table-rows"

type Props = {
    tasks: Task[];
    total: number;
    isLoading: boolean;
    searchParams: TaskSearchParams;
    setSearchParams: (updater: (prev: TaskSearchParams) => TaskSearchParams) => void;
    refetch: () => void;
}

export function TaskTable({
    tasks,
    total,
    isLoading,
    searchParams,
    setSearchParams,
    refetch
}: Props) {
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

    const { bulkDelete, bulkRerun } = useBulkTaskAction(Object.keys(rowSelection), () => {
        setRowSelection({});
        refetch();
    });

    const table = useReactTable({
        data: tasks || [],
        columns: createTaskColumns({ searchParams, setSearchParams }),
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        manualSorting: true,
        manualFiltering: true,
        manualPagination: true,
        pageCount: total,
        state: {
            rowSelection,
        },
        enableRowSelection: true,
        getRowId: (row) => row.id,
    });

    const selectedRowCount = Object.keys(rowSelection).length;
    const totalRowCount = table.getFilteredRowModel().rows.length;

    return (

        <div className="w-full">
            <div className="flex flex-col justify-between py-4 gap-2">
                <SearchBar
                    onSearch={(search) => setSearchParams(prev => ({ ...prev, search }))}
                />
                <BulkActionButtonGroup
                    selectedRowCount={selectedRowCount}
                    totalRowCount={totalRowCount}
                    bulkDelete={bulkDelete}
                    bulkRerun={bulkRerun}
                    clearSelection={() => setRowSelection({})}
                />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        <TaskTableRows
                            isLoading={isLoading}
                            rows={table.getRowModel().rows}
                        />
                    </TableBody>
                </Table>
            </div>
            <Pagination
                page={searchParams.pageIndex}
                totalPages={total}
                onPrevious={() => setSearchParams(prev => ({ ...prev, pageIndex: Math.max(0, prev.pageIndex - 1) }))}
                onNext={() => setSearchParams(prev => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
            />
        </div>
    )
}