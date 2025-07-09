"use server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

export const getServerRoutes = async () => ({
    api: {
        login: `${BACKEND_URL}/api/login`,
        tasks: {
            index: `${BACKEND_URL}/api/v1/tasks`,
            rerun: `${BACKEND_URL}/api/v1/tasks/rerun`,
            details: (id: string) => `${BACKEND_URL}/api/v1/tasks/${id}`,
            start: (id: string) => `${BACKEND_URL}/api/v1/tasks/${id}/start`,
            stop: (id: string) => `${BACKEND_URL}/api/v1/tasks/${id}/stop`,
        }
    }
})