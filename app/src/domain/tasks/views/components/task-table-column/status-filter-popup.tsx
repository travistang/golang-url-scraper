import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskSearchParams, TaskStatus } from "../../../types";
import { TaskStatusBadge } from "../task-status-badge";

type Props = {
    searchParams: TaskSearchParams;
    setSearchParams: (
        params: (prev: TaskSearchParams) => TaskSearchParams
    ) => void;
}
export const StatusFilterPopup = ({ searchParams, setSearchParams }: Props) => {
    return (
        <div className="grid gap-4">
            <div className="space-y-2">
                <h4 className="leading-none font-medium">Filter by status</h4>
                <p className="text-muted-foreground text-sm">
                    Select the status to filter by.
                </p>
            </div>
            <div className="flex flex-col gap-2">
                <Select

                    value={searchParams.status}
                    onValueChange={(value) => setSearchParams(prev => ({ ...prev, status: value as TaskStatus }))}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.values(TaskStatus).map(status => (
                            <SelectItem key={status} value={status}>
                                <TaskStatusBadge status={status} />
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => setSearchParams(prev => ({ ...prev, status: undefined }))}>
                    Clear
                </Button>
            </div>
        </div>
    )
}