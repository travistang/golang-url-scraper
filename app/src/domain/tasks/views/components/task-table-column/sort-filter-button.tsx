import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Task } from "@/domain/tasks/types";
import { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, FilterIcon } from "lucide-react";

export type SortFilterButtonProps = {
    column: Column<Task>;
    sortOrder?: boolean;
    onToggleSorting?: () => void;
    children?: React.ReactNode;
    label?: React.ReactNode;
    onFilter?: (value: string) => void;
}

const sortIcon = (sortOrder: SortFilterButtonProps["sortOrder"]) => {
    if (sortOrder === undefined) return ArrowUpDown;
    if (sortOrder) return ArrowDown;
    return ArrowUp;
}

export const SortFilterButton = ({
    column,
    sortOrder,
    onToggleSorting,
    onFilter,
    children,
    label = column.id,
}: SortFilterButtonProps) => {
    const SortIcon = sortIcon(sortOrder);
    return (
        <Popover>
            <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
                {label}
                {onToggleSorting && (
                    <Button variant="ghost" size="icon" onClick={onToggleSorting}>
                        <SortIcon className="h-2 w-2" />
                    </Button>
                )}
                {onFilter && children && (
                    <>
                        <PopoverTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <FilterIcon className="h-2 w-2" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            {children}
                        </PopoverContent>
                    </>
                )}
            </div>

        </Popover>
    )
}