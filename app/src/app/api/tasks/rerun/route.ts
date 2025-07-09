import { getServerRoutes } from "@/constants/server-routes";
import { retrieveToken } from "@/domain/auth/helpers/retrieve-token";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const token = await retrieveToken();
    const { api } = await getServerRoutes();
    const body = await request.json();
    const response = await axios.post(api.tasks.rerun, body, {
        headers: {
            Authorization: token,
        },
    });
    return NextResponse.json(response.data, { status: 201 });
}