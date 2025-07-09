import { routes } from "@/constants/routes";
import { getServerRoutes } from "@/constants/server-routes";
import { retrieveToken } from "@/domain/auth/helpers/retrieve-token";
import { Task } from "@/domain/tasks/types";
import TaskDetailPage from "@/domain/tasks/views/detail-page/detail-page";
import axios from "axios";
import { redirect } from "next/navigation";

export default async function DetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const token = await retrieveToken();
        if (!token) {
            redirect(routes.pages.login);
        }
        const serverRoutes = await getServerRoutes();
        const { data } = await axios.get<Task>(serverRoutes.api.tasks.details(id), {
            headers: {
                Authorization: token,
            }
        });
        return <TaskDetailPage initialData={data} />
    } catch (error) {
        console.error(error);
        redirect(routes.pages.login);
    }
} 