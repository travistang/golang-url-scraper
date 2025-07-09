import { getServerRoutes } from "@/constants/server-routes";
import { retrieveToken } from "@/domain/auth/helpers/retrieve-token";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; action: string }> }
) {
    const { id, action } = await params;
    try {

        if (!['start', 'stop'].includes(action)) {
            return NextResponse.json(
                { error: "Invalid action. Must be 'start' or 'stop'" },
                { status: 400 }
            );
        }

        const token = await retrieveToken();
        const serverRoutes = await getServerRoutes();

        const endpoint = action === 'start'
            ? serverRoutes.api.tasks.start(id)
            : serverRoutes.api.tasks.stop(id);

        const response = await axios.post(endpoint, null, {
            headers: {
                Authorization: token,
            },
        });

        return NextResponse.json(response.data);
    } catch (error) {
        console.error(`Error ${action}ing task:`, error);
        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json(
                error.response.data,
                { status: error.response.status }
            );
        }

        return NextResponse.json(
            { error: `Failed to ${action} task` },
            { status: 500 }
        );
    }
} 