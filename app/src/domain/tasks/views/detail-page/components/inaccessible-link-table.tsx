import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { flexRender, getCoreRowModel, Row, useReactTable } from "@tanstack/react-table";

type Props = {
    inaccessibleLinks: {
        url: string;
        statusCode: number;
    }[];
    className?: string;
}

const columns = [
    {
        header: "URL",
        accessorKey: "url",
    },
    {
        header: "Status Code",
        accessorKey: "statusCode",
        cell: ({ row }: { row: Row<typeof data[number]> }) => {
            return <span>{row.original.statusCode || '--'}</span>
        }
    },
];

const data = [
    {
        url: "https://www.google.com",
        statusCode: 404,
    },
    {
        url: "https://www.google.com/not-found",
        statusCode: 404,
    },
    {
        url: "https://www.google.com/forbidden",
        statusCode: 403,
    },
    {
        url: "https://www.google.com/cannot-connect",
        statusCode: 0,
    },
]
export const InaccessibleLinkTable = ({ inaccessibleLinks, className }: Props) => {
    const table = useReactTable({
        data: inaccessibleLinks,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getRowId: (row) => row.url,
    });

    return (
        <Card className={className}>
            <CardHeader>
                Inaccessible links
            </CardHeader>
            <CardContent>
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
                        {table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}