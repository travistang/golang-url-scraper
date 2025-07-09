"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTask } from "@/domain/tasks/hooks/use-task";
import { InaccessibleLinkTable } from "@/domain/tasks/views/detail-page/components/inaccessible-link-table";
import { LinksChart } from "@/domain/tasks/views/detail-page/components/links-chart";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Task } from "../../types";

type Props = {
    initialData?: Task
}
export default function TaskDetailPage({ initialData }: Props) {
    const router = useRouter();
    const { task, isLoading } = useTask(initialData);
    return (
        <div className="container mx-auto max-h-screen p-6">
            <div className="flex flex-col items-start mb-6">
                <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-2"
                    disabled={isLoading}
                    onClick={() => router.back()}>
                    <ArrowLeftIcon className="w-4 h-4" />
                    Back to tasks
                </Button>
                <h1 className="text-3xl font-bold mb-6">Task Details</h1>
            </div>
            <div className="gap-2 grid grid-cols-2 md:grid-cols-4">
                <Card className="col-span-full lg:col-span-2">
                    <CardHeader>
                        URL
                    </CardHeader>
                    <CardContent>
                        <p>{task?.url}</p>
                    </CardContent>
                </Card>
                <Card className="col-span-full md:col-span-2 lg:col-span-1">
                    <CardHeader>
                        Status
                    </CardHeader>
                    <CardContent>
                        <p>{task?.status}</p>
                    </CardContent>
                </Card>
                <LinksChart className="col-span-full md:col-span-2 lg:col-span-1" internalLinks={task?.internalLinks || 0} externalLinks={task?.externalLinks || 0} />
                <InaccessibleLinkTable
                    className="col-span-full"
                    inaccessibleLinks={task?.inaccessibleLinks ?? []}
                />
            </div>
        </div>
    )
} 