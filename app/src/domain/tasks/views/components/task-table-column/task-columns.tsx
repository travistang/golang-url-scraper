"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Column, ColumnDef } from "@tanstack/react-table"
import { formatDistanceToNow } from "date-fns"
import { Task, TaskSearchParams } from "../../../types"
import { TaskStatusBadge } from "../task-status-badge"
import { SortFilterButton } from "./sort-filter-button"

export const COLUMNS_COUNT = 5;

type Props = {
    searchParams: TaskSearchParams;
    setSearchParams: (
        params: (prev: TaskSearchParams) => TaskSearchParams
    ) => void;
}
export const createTaskColumns = ({ setSearchParams }: Props): ColumnDef<Task>[] => {
    const toggleSorting = (column: Column<Task>) => {
        setSearchParams(prev => {
            const sorting = prev.sorting.find(s => s.id === column.id)
            if (sorting) {
                return { ...prev, sorting: [{ id: column.id, desc: !sorting.desc }] }
            }
            return { ...prev, sorting: [{ id: column.id, desc: true }] }
        })

    }
    return [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },

        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = row.getValue("status") as Task["status"]
                return (
                    <TaskStatusBadge status={status} />
                )
            },
        },
        {
            accessorKey: "url",
            header: ({ column }) => {
                return (
                    <SortFilterButton
                        column={column}
                        sortOrder={column.getIsSorted() as "asc" | "desc" | undefined}
                        onToggleSorting={() => toggleSorting(column)}
                        label="URL"
                        onFilter={() => { }}
                    >
                    </SortFilterButton>
                )
            },
            cell: ({ row }) => {
                const url = row.getValue("url") as string
                return (
                    <div className="max-w-[300px] truncate font-medium">
                        {url}
                    </div>
                )
            },
        },
        {
            accessorKey: "pageTitle",
            header: ({ column }) => {
                return (
                    <SortFilterButton
                        column={column}
                        sortOrder={column.getIsSorted() as "asc" | "desc" | undefined}
                        onToggleSorting={() => toggleSorting(column)}
                        onFilter={() => { }}
                        label="Page Title"
                    >
                    </SortFilterButton>
                )
            },
            cell: ({ row }) => {
                const title = row.getValue("pageTitle") as string | null
                return title || "—"
            },
        },

        {
            accessorKey: "submittedAt",
            header: ({ column }) => {
                return (
                    <SortFilterButton
                        column={column}
                        sortOrder={column.getIsSorted() as "asc" | "desc" | undefined}
                        onToggleSorting={() => toggleSorting(column)}
                        onFilter={() => { }}
                        label="Submitted At"
                    >
                    </SortFilterButton>
                )
            },
            cell: ({ row }) => {
                const date = new Date(row.getValue("submittedAt"))
                return (
                    <div className="text-xs text-gray-500 text-right">
                        {formatDistanceToNow(date, { addSuffix: true })}
                    </div>
                )
            },
        },

    ]
} 