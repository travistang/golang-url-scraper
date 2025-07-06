"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ColumnDef } from "@tanstack/react-table"
import { formatDistanceToNow } from "date-fns"
import { ArrowUpDown } from "lucide-react"
import { Task, TaskStatus } from "../../types"

const statusVariants = {
    [TaskStatus.Pending]: "secondary",
    [TaskStatus.Running]: "default",
    [TaskStatus.Completed]: "outline",
    [TaskStatus.Failed]: "destructive",
} as const

export const taskColumns: ColumnDef<Task>[] = [
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
                <Badge variant={statusVariants[status]}>
                    {status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "pageTitle",
        header: "Page Title",
        cell: ({ row }) => {
            const title = row.getValue("pageTitle") as string | null
            return title || "—"
        },
    },
    {
        accessorKey: "submittedAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Submitted At
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const date = new Date(row.getValue("submittedAt"))
            return (
                <div className="text-xs text-gray-500">
                    {formatDistanceToNow(date, { addSuffix: true })}
                </div>
            )
        },
    },
    {
        accessorKey: "url",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    URL
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
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
        accessorKey: "totalResults",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Results
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const count = row.getValue("totalResults") as number
            return <div className="text-center">{count || 0}</div>
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Created
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt"))
            return <div>{date.toLocaleDateString()}</div>
        },
    },
] 