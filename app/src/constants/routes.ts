export const routes = {
    api: {
        tasks: {
            index: "/api/tasks",
            rerun: "/api/tasks/rerun",
            details: (id: string) => `/api/tasks/${id}`,
            start: (id: string) => `/api/tasks/${id}/start`,
            stop: (id: string) => `/api/tasks/${id}/stop`,
        }
    },
    pages: {
        taskList: "/tasks",
        login: "/login",
        taskDetails: (id: string) => `/tasks/${id}`,
    }
}