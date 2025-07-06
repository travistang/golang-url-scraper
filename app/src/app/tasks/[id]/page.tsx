interface TaskDetailPageProps {
    params: {
        id: string
    }
}

export default function TaskDetailPage({ params }: TaskDetailPageProps) {
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Task Details</h1>
            <div className="space-y-4">
                <p className="text-muted-foreground">Task ID: {params.id}</p>
                <p className="text-muted-foreground">Task details will be implemented here</p>
            </div>
        </div>
    )
} 