import { routes } from "@/constants/routes";
import { getServerRoutes } from "@/constants/server-routes";
import { retrieveToken } from "@/domain/auth/helpers/retrieve-token";
import { TaskListFetchResult } from "@/domain/tasks/hooks/use-task-list";
import DashboardPage from "@/domain/tasks/views/dashboard-page/dashboard-page";
import axios from "axios";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export default async function TasksPage(request: NextRequest) {
    try {
        const token = await retrieveToken();
        if (!token) {
            redirect(routes.pages.login);
        }
        const serverRoutes = await getServerRoutes();
        const { data } = await axios.get<TaskListFetchResult>(serverRoutes.api.tasks.index, {
            headers: {
                Authorization: token,
            }
        });
        return <DashboardPage initialData={data} />
    } catch (error) {
        console.error(error);
        redirect(routes.pages.login);
    }
} 