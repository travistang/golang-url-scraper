import { getServerRoutes } from "@/constants/server-routes";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { api } = await getServerRoutes();
    const body = await request.json();
    const response = await axios.post(api.tasks.rerun, body);
    return NextResponse.json(response.data, { status: 201 });
}