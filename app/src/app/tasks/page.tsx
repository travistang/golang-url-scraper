import { TaskTable } from "@/domain/tasks/views/components/task-table";

export default async function TasksPage() {
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Tasks</h1>
            <TaskTable />
        </div>
    )
} 