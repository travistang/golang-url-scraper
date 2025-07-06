"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"
import { formatDistanceToNow } from "date-fns"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Task, TaskStatus } from "../../types"

const statusVariants = {
    [TaskStatus.Pending]: "secondary",
    [TaskStatus.Running]: "default",
    [TaskStatus.Completed]: "outline",
    [TaskStatus.Failed]: "destructive",
} as const

export const taskColumns: ColumnDef<Task>[] = [
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
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const task = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>

                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
] 