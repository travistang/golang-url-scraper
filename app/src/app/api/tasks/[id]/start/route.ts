import { getServerRoutes } from "@/constants/server-routes";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const serverRoutes = await getServerRoutes();
        const response = await axios.post(serverRoutes.api.tasks.start(id));
        return NextResponse.json(response.data);
    } catch (error) {
        console.error("Error starting task:", error);

        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json(
                error.response.data,
                { status: error.response.status }
            );
        }

        return NextResponse.json(
            { error: "Failed to start task" },
            { status: 500 }
        );
    }
} 