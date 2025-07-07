import { Badge } from "@/components/ui/badge";
import { TaskStatus } from "../../types";

const statusVariants = {
    [TaskStatus.Pending]: "secondary",
    [TaskStatus.Running]: "default",
    [TaskStatus.Completed]: "outline",
    [TaskStatus.Failed]: "destructive",
} as const

type Props = {
    status: TaskStatus;
    className?: string;
}
export const TaskStatusBadge = ({ status, className }: Props) => {
    return (
        <Badge variant={statusVariants[status]} className={className}>
            {status}
        </Badge>
    )
}   