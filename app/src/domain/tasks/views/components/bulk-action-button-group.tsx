import { Button } from "@/components/ui/button";

type Props = {
    selectedRowCount: number;
    totalRowCount: number;
    bulkDelete: () => void;
    clearSelection: () => void;
}
export const BulkActionButtonGroup = ({ selectedRowCount, totalRowCount, bulkDelete, clearSelection }: Props) => {
    if (selectedRowCount === 0) return null;
    return (
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
                onClick={clearSelection}
            >
                Clear selection
            </Button>
        </div>
    )
}