"use client";
import { useTaskList } from "@/domain/tasks/hooks/use-task-list";
import { CreateTaskDialog } from "@/domain/tasks/views/components/create-task-dialog/create-task-dialog";
import { TaskTable } from "@/domain/tasks/views/components/task-table";

export default function TasksPage() {
    const {
        tasks = [],
        total,
        isLoading,
        searchParams,
        setSearchParams,
        refetch
    } = useTaskList();
    return (
        <div className="container mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold mb-6">Tasks</h1>
                <CreateTaskDialog onCreate={refetch} />
            </div>
            <TaskTable
                tasks={tasks}
                total={total || 0}
                isLoading={isLoading}
                searchParams={searchParams} setSearchParams={setSearchParams}
                refetch={refetch}
            />
        </div>
    )
} 