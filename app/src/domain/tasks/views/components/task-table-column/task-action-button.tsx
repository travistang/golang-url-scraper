import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { routes } from "@/constants/routes";
import { Task, TaskStatus } from "@/domain/tasks/types";
import axios from "axios";
import { PauseIcon, PlayIcon } from "lucide-react";
import useSWRMutation from "swr/mutation";
type Props = {
    task: Task;
}
const mutateTask = async (url: string, { arg }: { arg: { id: string } }) => {
    const response = await axios.post(url, { id: arg.id });
    return response.data;
}
export const TaskActionButton = ({ task }: Props) => {
    const { id, status } = task;
    const isRunning = status === TaskStatus.Running;
    const { trigger: startStopTask, isMutating } = useSWRMutation(
        isRunning ? routes.api.tasks.stop(id) : routes.api.tasks.start(id),
        mutateTask,
    );

    return (
        <div className="text-right">
            <Tooltip>
                <TooltipTrigger asChild disabled={isMutating} onClick={() => startStopTask({ id })}>
                    {isRunning ? (
                        <PauseIcon className="w-4 h-4" />
                    ) : (
                        <PlayIcon className="w-4 h-4" />
                    )}
                </TooltipTrigger>
                <TooltipContent>
                    {isRunning ? "Pause" : "Start"}
                </TooltipContent>
            </Tooltip>
        </div >
    )
}