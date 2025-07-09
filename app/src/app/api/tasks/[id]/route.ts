import { getServerRoutes } from "@/constants/server-routes";
import { retrieveToken } from "@/domain/auth/helpers/retrieve-token";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";


export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const token = await retrieveToken();
        const serverRoutes = await getServerRoutes();
        const response = await axios.get(serverRoutes.api.tasks.details(id), {
            headers: {
                Authorization: token,
            },
        });
        return NextResponse.json(response.data);
    } catch (error) {
        console.error("Error fetching task:", error);

        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json(
                error.response.data,
                { status: error.response.status }
            );
        }

        return NextResponse.json(
            { error: "Failed to fetch task" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const token = await retrieveToken();
        const serverRoutes = await getServerRoutes();
        const response = await axios.delete(serverRoutes.api.tasks.details(id), {
            headers: {
                Authorization: token,
            },
        });
        return NextResponse.json(response.data);
    } catch (error) {
        console.error("Error deleting task:", error);

        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json(
                error.response.data,
                { status: error.response.status }
            );
        }

        return NextResponse.json(
            { error: "Failed to delete task" },
            { status: 500 }
        );
    }
} 