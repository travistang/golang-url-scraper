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

const defaultSearchParams: TaskSearchParams = {
    pageIndex: 0,
    pageSize: 10,
    totalPages: 1,
    sorting: [],
    filters: [],
}

const createSearchParams = (searchParams: TaskSearchParams) => {
    const params = new URLSearchParams();
    params.append('page', searchParams.pageIndex.toString());
    params.append('pageSize', searchParams.pageSize.toString());
    params.append('sortBy', searchParams.sorting[0]?.id || '');
    params.append('sortOrder', searchParams.sorting[0]?.desc ? 'desc' : 'asc');
    return params.toString();
}
export const useTaskList = () => {
    const [searchParams, setSearchParams] = useState<TaskSearchParams>(defaultSearchParams);
    const { data: fetchResult, isLoading, error } = useSWR(`${routes.api.tasks.index}?${createSearchParams(searchParams)}`, fetchTasks);

    return {
        searchParams,
        setSearchParams,
        ...fetchResult,
        isLoading,
        error,
    }
}