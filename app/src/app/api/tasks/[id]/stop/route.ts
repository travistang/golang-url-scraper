import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        const response = await axios.post(`${BACKEND_URL}/api/v1/tasks/${id}/stop`);
        return NextResponse.json(response.data);
    } catch (error) {
        console.error("Error stopping task:", error);

        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json(
                error.response.data,
                { status: error.response.status }
            );
        }

        return NextResponse.json(
            { error: "Failed to stop task" },
            { status: 500 }
        );
    }
} 