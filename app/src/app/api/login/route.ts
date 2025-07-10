import { getServerRoutes } from "@/constants/server-routes";
import { signJwt } from "@/domain/auth/jwt/sign";
import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();
        const serverRoutes = await getServerRoutes();
        const response = await axios.post(serverRoutes.api.login, { username, password });
        const token = response.data.token;
        const jwt = signJwt({ token });

        const cookieStore = await cookies();
        cookieStore.set("token", jwt, {
            httpOnly: true,
            sameSite: "strict",
        });

        return NextResponse.json({ message: "Login successful" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }
}