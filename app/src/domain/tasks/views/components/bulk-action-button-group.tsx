import { Button } from "@/components/ui/button";
import { TEST_IDS } from "@/constants/test-ids";

type Props = {
    selectedRowCount: number;
    totalRowCount: number;
    bulkDelete: () => void;
    bulkRerun: () => void;
    clearSelection: () => void;
}
export const BulkActionButtonGroup = ({ selectedRowCount, totalRowCount, bulkDelete, bulkRerun, clearSelection }: Props) => {
    if (selectedRowCount === 0) return null;
    return (
        <div className="flex items-center space-x-2">
            <div className="text-sm text-muted-foreground">
                {selectedRowCount} of {totalRowCount} row(s) selected
            </div>
            <Button
                data-testid={TEST_IDS.BULK_DELETE_BUTTON}
                variant="outline"
                size="sm"
                onClick={bulkDelete}
            >
                Delete Selected
            </Button>
            <Button
                variant="outline"
                size="sm"
                onClick={bulkRerun}
            >
                Re-run Selected
            </Button>
            <Button
                data-testid={TEST_IDS.BULK_CLEAR_SELECTION_BUTTON}
                variant="outline"
                size="sm"
                onClick={clearSelection}
            >
                Clear selection
            </Button>
        </div>
    )
}