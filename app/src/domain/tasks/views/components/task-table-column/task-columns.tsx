"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { ColumnDef } from "@tanstack/react-table"
import { formatDistanceToNow } from "date-fns"
import { Task, TaskSearchParams, TaskStatus } from "../../../types"
import { TaskStatusBadge } from "../task-status-badge"
import { SortFilterButton } from "./sort-filter-button"
import { StatusFilterPopup } from "./status-filter-popup"
import { TaskActionButton } from "./task-action-button"

export const COLUMNS_COUNT = 6;

type Props = {
    searchParams: TaskSearchParams;
    setSearchParams: (
        params: (prev: TaskSearchParams) => TaskSearchParams
    ) => void;
}
export const createTaskColumns = ({ searchParams, setSearchParams }: Props): ColumnDef<Task>[] => {
    const toggleSorting = (id: string) => {
        setSearchParams(prev => {
            const sorting = prev.sorting.find(s => s.id === id)
            if (sorting) {
                return { ...prev, sorting: [{ id, desc: !sorting.desc }] }
            }
            return { ...prev, sorting: [{ id, desc: true }] }
        })

    }
    return [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    onClick={(e) => e.stopPropagation()}
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
                    onClick={(e) => e.stopPropagation()}
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
            header: ({ column }) => {
                return (
                    <SortFilterButton
                        label="Status"
                        column={column}
                        onFilter={(value) => { setSearchParams(prev => ({ ...prev, status: value as TaskStatus })) }}
                    >
                        <StatusFilterPopup
                            searchParams={searchParams}
                            setSearchParams={setSearchParams}
                        />
                    </SortFilterButton>
                )
            },
            cell: ({ row, column }) => {
                return <TaskStatusBadge status={row.getValue("status") as TaskStatus} />
            },
        },
        {
            accessorKey: "url",
            header: ({ column }) => {
                return (
                    <SortFilterButton
                        column={column}
                        sortOrder={searchParams.sorting.find(s => s.id === column.id)?.desc}
                        onToggleSorting={() => toggleSorting(column.id)}
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
                        sortOrder={searchParams.sorting.find(s => s.id === column.id)?.desc}
                        onToggleSorting={() => toggleSorting(column.id)}
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
                        sortOrder={searchParams.sorting.find(s => s.id === column.id)?.desc}
                        onToggleSorting={() => toggleSorting(column.id)}
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
        {
            accessorKey: "actions",
            header: "",
            cell: ({ row }) => {
                return (
                    <TaskActionButton
                        task={row.original}
                    />
                );
            },
        },

    ]
} 