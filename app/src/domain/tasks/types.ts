import { PaginationState, SortingState } from "@tanstack/react-table";

export enum TaskStatus {
    Pending = "pending",
    Running = "running",
    Completed = "completed",
    Failed = "failed",
}

export type Task = {
    id: string;
    url: string;
    status: TaskStatus;
    submittedAt: string;
    requestProcessingAt: number | null;
    createdAt: string;
    totalResults?: number | null;

    startedAt?: string | null;
    completedAt?: string | null;
    htmlVersion?: string | null;
    pageTitle?: string | null;
    hasLoginForm?: boolean | null;
    h1Count?: number | null;
    h2Count?: number | null;
    h3Count?: number | null;
    h4Count?: number | null;
    h5Count?: number | null;
    h6Count?: number | null;
    internalLinks?: number | null;
    externalLinks?: number | null;
    inaccessibleLinks?: number | null;
}


export interface TaskSearchParams extends PaginationState {
    sorting: SortingState;
    search?: string;
    status?: TaskStatus;
}