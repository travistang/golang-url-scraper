import { routes } from "@/constants/routes";
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

const defaultSearchParams: TaskSearchParams = {
    pageIndex: 0,
    pageSize: 5,
    sorting: [],
}

const createSearchParams = (searchParams: TaskSearchParams) => {
    const params = new URLSearchParams();
    params.append('page', searchParams.pageIndex.toString());
    params.append('pageSize', searchParams.pageSize.toString());
    params.append('sortBy', searchParams.sorting[0]?.id || '');
    params.append('sortOrder', searchParams.sorting[0]?.desc ? 'desc' : 'asc');
    if (searchParams.search) {
        params.append('globalSearch', searchParams.search);
    }
    if (searchParams.status) {
        params.append('status', searchParams.status);
    }
    return params.toString();
}

export const useTaskList = (initialData?: TaskListFetchResult) => {
    const [searchParams, setSearchParams] = useState<TaskSearchParams>(defaultSearchParams);
    const {
        data: fetchResult,
        isLoading,
        error,
        mutate: refetch
    } = useSWR(
        `${routes.api.tasks.index}?${createSearchParams(searchParams)}`, fetchTasks, {
        refreshInterval: 1000,
        fallbackData: initialData,
    });

    return {
        searchParams,
        setSearchParams,
        refetch,
        ...fetchResult,
        isLoading,
        error,
    }
}