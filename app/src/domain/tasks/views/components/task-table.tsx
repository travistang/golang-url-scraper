"use client"

import {
    ColumnFiltersState,
    RowSelectionState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ChevronLeft, ChevronRight } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { routes } from "@/constants/route"
import axios from "axios"
import useSWR from "swr"
import { Task } from "../../types"
import { taskColumns } from "./task-columns"

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export function TaskTable() {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
    const { data, isLoading, error } = useSWR(routes.api.tasks.index, fetcher);

    const table = useReactTable({
        data: data?.tasks || [],
        columns: taskColumns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        initialState: {
            pagination: {
                pageSize: 10,
            },
        },
        state: {
            sorting,
            columnFilters,
            rowSelection,
        },
        enableRowSelection: true,
        getRowId: (row) => row.id,
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    const selectedRowCount = table.getFilteredSelectedRowModel().rows.length;
    const totalRowCount = table.getFilteredRowModel().rows.length;
    const selectedTasks = table.getFilteredSelectedRowModel().rows.map(row => row.original as Task);

    const handleBulkAction = (action: string) => {
        console.log(`Performing ${action} on selected tasks:`, selectedTasks);
        // TODO: Implement bulk actions (delete and re-run)
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between py-4">
                <Input
                    placeholder="Filter URLs..."
                    value={(table.getColumn("url")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("url")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
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
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={taskColumns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-center space-x-4 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm font-medium">
                    Page {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}