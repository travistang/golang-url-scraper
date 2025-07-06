"use client"

import {
    ColumnFiltersState,
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
import { Task, TaskStatus } from "../../types"
import { taskColumns } from "./task-columns"

const mockTasks: Task[] = [
    {
        id: "1",
        url: "https://example.com",
        status: TaskStatus.Completed,
        submittedAt: "2024-01-15T10:30:00Z",
        requestProcessingAt: 1714857600,
        createdAt: "2024-01-15T10:30:00Z",
        totalResults: 11,
        pageTitle: "Example Domain",
        hasLoginForm: false,
        h1Count: 1,
        h2Count: 2,
        internalLinks: 5,
        externalLinks: 3,
        inaccessibleLinks: 0,
    },
    {
        id: "2",
        url: "https://blog.example.com",
        status: TaskStatus.Completed,
        submittedAt: "2024-01-14T09:15:00Z",
        requestProcessingAt: 1714857650,
        createdAt: "2024-01-14T09:15:00Z",
        totalResults: 26,
        pageTitle: "Blog - Another Site",
        hasLoginForm: true,
        h1Count: 1,
        h2Count: 5,
        internalLinks: 12,
        externalLinks: 8,
        inaccessibleLinks: 1,
    },
    {
        id: "3",
        url: "https://pending.example.com",
        status: TaskStatus.Pending,
        submittedAt: "2024-01-13T14:20:00Z",
        requestProcessingAt: null,
        createdAt: "2024-01-13T14:20:00Z",
        totalResults: null,
        pageTitle: null,
        hasLoginForm: null,
        h1Count: null,
        h2Count: null,
        internalLinks: null,
        externalLinks: null,
        inaccessibleLinks: null,
    },
    {
        id: "4",
        url: "https://failed.example.com",
        status: TaskStatus.Failed,
        submittedAt: "2024-01-12T16:45:00Z",
        requestProcessingAt: null,
        createdAt: "2024-01-12T16:45:00Z",
        totalResults: null,
        pageTitle: null,
        hasLoginForm: null,
        h1Count: null,
        h2Count: null,
        internalLinks: null,
        externalLinks: null,
        inaccessibleLinks: null,
    },
    {
        id: "5",
        url: "https://docs.example.com",
        status: TaskStatus.Completed,
        submittedAt: "2024-01-11T08:30:00Z",
        requestProcessingAt: 1714857700,
        createdAt: "2024-01-11T08:30:00Z",
        totalResults: 69,
        pageTitle: "Documentation Home",
        hasLoginForm: false,
        h1Count: 1,
        h2Count: 8,
        h3Count: 15,
        internalLinks: 42,
        externalLinks: 12,
        inaccessibleLinks: 2,
    },
]

export function TaskTable() {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

    const table = useReactTable({
        data: mockTasks,
        columns: taskColumns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
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
        },
    })

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <Input
                    placeholder="Filter URLs..."
                    value={(table.getColumn("url")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("url")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
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