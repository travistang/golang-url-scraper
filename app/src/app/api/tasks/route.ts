import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const queryString = searchParams.toString();

        const backendUrl = `${BACKEND_URL}/api/v1/tasks?${queryString}`;

        const response = await axios.get(backendUrl);
        return NextResponse.json(response.data);
    } catch (error) {
        console.error("Error fetching tasks:", error);

        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json(
                error.response.data,
                { status: error.response.status }
            );
        }

        return NextResponse.json(
            { error: "Failed to fetch tasks" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const response = await axios.post(`${BACKEND_URL}/api/v1/tasks`, body);
        return NextResponse.json(response.data, { status: 201 });
    } catch (error) {
        console.error("Error creating task:", error);

        if (axios.isAxiosError(error) && error.response) {
            return NextResponse.json(
                error.response.data,
                { status: error.response.status }
            );
        }

        return NextResponse.json(
            { error: "Failed to create task" },
            { status: 500 }
        );
    }
} 