import { routes } from "@/constants/route";
import axios from "axios";
import { useState } from "react";
import useSWR from "swr";
import { Task, TaskSearchParams } from "../types";

export type TaskListFetchResult = {
    tasks: Task[];
    total: number;
    page: number;
    limit: number;
}

const fetchTasks = async (url: string): Promise<TaskListFetchResult> => {
    const response = await axios.get<TaskListFetchResult>(url);
    return response.data;
}

export const useTaskList = () => {
    const [searchParams, setSearchParams] = useState<TaskSearchParams>({});
    const { data: fetchResult, isLoading, error } = useSWR(() => `${routes.api.tasks.index}?${new URLSearchParams(searchParams as Record<string, string>).toString()}`, fetchTasks);

    return {
        searchParams,
        setSearchParams,
        ...fetchResult,
        isLoading,
        error,
    }
}