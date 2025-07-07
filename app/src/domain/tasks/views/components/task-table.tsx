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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { useTaskList } from "../../hooks/use-task-list"
import { Task } from "../../types"
import { createTaskColumns } from "./task-table-column/task-columns"
import { TaskTableRows } from "./task-table-rows"


export function TaskTable() {
    const { tasks = [], isLoading, searchParams, setSearchParams } = useTaskList();
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

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
        pageCount: searchParams.totalPages || 0,
        state: {
            sorting: searchParams.sorting,
            columnFilters: searchParams.filters,
            rowSelection,
            pagination: {
                pageIndex: searchParams.pageIndex,
                pageSize: searchParams.pageSize,
            },
        },
        enableRowSelection: true,
        getRowId: (row) => row.id,
    });

    const selectedRowCount = table.getFilteredSelectedRowModel().rows.length;
    const totalRowCount = table.getFilteredRowModel().rows.length;
    const selectedTasks = table.getFilteredSelectedRowModel().rows.map(row => row.original as Task);

    const handleBulkAction = (action: string) => {
        console.log(`Performing ${action} on selected tasks:`, selectedTasks);
        // TODO: Implement bulk actions (delete and re-run)
    };

    return (
        <div className="w-full">
            <div className="flex flex-col lg:flex-row justify-between py-4 gap-2">
                <Input
                    placeholder="Filter URLs..."
                    value={(table.getColumn("url")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("url")?.setFilterValue(event.target.value)
                    }
                    className="w-full lg:max-w-sm"
                />
                {selectedRowCount > 0 && (
                    <div className="flex items-center space-x-2">
                        <div className="text-sm text-muted-foreground">
                            {selectedRowCount} of {totalRowCount} row(s) selected
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBulkAction('delete')}
                        >
                            Delete Selected
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setRowSelection({})}
                        >
                            Clear selection
                        </Button>
                    </div>
                )}
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
                totalPages={searchParams.totalPages || 0}
                onPrevious={() => setSearchParams(prev => ({ ...prev, pageIndex: Math.max(0, prev.pageIndex - 1) }))}
                onNext={() => setSearchParams(prev => ({ ...prev, pageIndex: prev.pageIndex + 1 }))}
            />
        </div>
    )
}