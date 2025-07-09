import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

type Props = {
    page: number;
    totalPages: number;
    onPrevious: () => void;
    onNext: () => void;
}
export const Pagination = ({ page, totalPages = 0, onPrevious, onNext }: Props) => {
    return (
        <div className="flex items-center justify-center space-x-4 py-4">
            <Button
                variant="outline"
                size="sm"
                onClick={onPrevious}
                disabled={page === 0}
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium">
                Page {page + 1} of {totalPages}
            </div>
            <Button
                variant="outline"
                size="sm"
                onClick={onNext}
                disabled={page === totalPages - 1}
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    )
}