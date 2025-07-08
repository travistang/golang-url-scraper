import { getServerRoutes } from "@/constants/server-routes";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const queryString = searchParams.toString();
        const serverRoutes = await getServerRoutes();
        const backendUrl = `${serverRoutes.api.tasks.index}?${queryString}`;

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

        const serverRoutes = await getServerRoutes();
        const response = await axios.post(serverRoutes.api.tasks.index, body);
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

export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();

        const serverRoutes = await getServerRoutes();
        const response = await axios.delete(serverRoutes.api.tasks.index, { data: body });
        return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
        console.error("Error deleting tasks:", error);
    }
}