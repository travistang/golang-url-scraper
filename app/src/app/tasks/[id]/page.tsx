"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useTask } from "@/domain/tasks/hooks/use-task";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface TaskDetailPageProps {
    params: {
        id: string
    }
}

export default function TaskDetailPage({ params }: TaskDetailPageProps) {
    const router = useRouter();
    const { task, isLoading, refetch } = useTask();
    return (
        <div className="container mx-auto p-6">
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
                <Card className="col-span-full md:col-span-3">
                    <CardHeader>
                        URL
                    </CardHeader>
                    <CardContent>
                        <p>{task?.url}</p>
                    </CardContent>
                </Card>
                <Card className="col-span-full md:col-span-1">
                    <CardHeader>
                        Status
                    </CardHeader>
                    <CardContent>
                        <p>{task?.status}</p>
                    </CardContent>
                </Card>
                <Card className="col-span-full md:col-span-1">
                    <CardHeader>
                        Interval links vs External links
                    </CardHeader>
                    <CardContent>
                        <p>{task?.internalLinks} / {task?.externalLinks}</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
} 