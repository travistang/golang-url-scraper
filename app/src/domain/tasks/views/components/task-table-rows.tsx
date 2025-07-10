import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import { flexRender, Row } from "@tanstack/react-table";

import { routes } from "@/constants/routes";
import { useRouter } from "next/navigation";
import { Task } from "../../types";
import { COLUMNS_COUNT } from "./task-table-column/task-columns";

const SkeletonRow = () => {
    return (
        <TableRow>
            <TableCell colSpan={COLUMNS_COUNT} className="py-2 text-center">
                <Skeleton className="h-4 w-full" />
            </TableCell>
        </TableRow>
    )
}
type Props = {
    isLoading?: boolean;
    rows: Row<Task>[];
}

export const TaskTableRows = ({ isLoading, rows }: Props) => {
    const router = useRouter();
    if (isLoading) {
        return (
            <>
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
                <SkeletonRow />
            </>
        )
    }

    if (!rows?.length) {
        return (
            <TableRow>
                <TableCell colSpan={COLUMNS_COUNT} className="h-24 text-center">
                    No results.
                </TableCell>
            </TableRow>
        )
    }
    return (
        rows.map((row) => (
            <TableRow
                onClick={() => router.push(routes.pages.taskDetails(row.id))}
                className="cursor-pointer"
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
    )
}