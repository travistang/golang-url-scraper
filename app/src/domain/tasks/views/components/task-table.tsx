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
import { useBulkTaskAction } from "../../hooks/use-bulk-task-action"
import { useTaskList } from "../../hooks/use-task-list"
import { createTaskColumns } from "./task-table-column/task-columns"
import { TaskTableRows } from "./task-table-rows"


export function TaskTable() {
    const {
        tasks = [],
        isLoading,
        searchParams,
        setSearchParams,
        refetch
    } = useTaskList();
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

    const { bulkDelete } = useBulkTaskAction(Object.keys(rowSelection), () => {
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
        pageCount: searchParams.totalPages || 0,
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
                            onClick={bulkDelete}
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