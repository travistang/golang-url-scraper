"use client";
import { routes } from "@/constants/routes";
import axios from "axios";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { Task } from "../types";

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export const useTask = (initialData?: Task) => {
    const { id } = useParams();
    const { data: task, isLoading, mutate } = useSWR<Task>(
        routes.api.tasks.details(id as string),
        fetcher,
        {
            refreshInterval: 1000,
            fallbackData: initialData,
        }
    );
    return {
        task,
        isLoading,
        refetch: mutate
    };
}