"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { routes } from "@/constants/routes";
import axios from "axios";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import useSWRMutation from "swr/mutation";

const createTask = async (url: string, { arg }: { arg: { url: string } }) => {
    const response = await axios.post(url, { url: arg.url });
    return response.data;
}
type Props = {
    onCreate: () => void;
}
export const CreateTaskDialog = ({ onCreate }: Props) => {
    const [url, setUrl] = useState("");
    const [open, setOpen] = useState(false);
    const {
        trigger: createTaskTrigger,
        isMutating
    } = useSWRMutation(
        routes.api.tasks.index,
        createTask,
        {
            onSuccess: () => {
                setOpen(false);
                onCreate();
            },
            onError: () => {
                toast.error("Failed to create task. Check if the URL is valid");
            }
        }
    );
    const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createTaskTrigger({ url });
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusIcon className="w-4 h-4" />
                    Add Task
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Task</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Add a new task to the list.
                </DialogDescription>
                <form onSubmit={handleCreate} className="flex flex-col items-end gap-2">
                    <Input
                        placeholder="URL to scrape"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                    <Button
                        type="submit"
                        disabled={isMutating}
                    >
                        {isMutating ? "Creating Task..." : "Create"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}