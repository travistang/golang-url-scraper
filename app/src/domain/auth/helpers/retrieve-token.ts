"use server";

import { cookies } from "next/headers";
import { decodeJwt } from "../jwt/sign";

export const retrieveToken = async () => {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value || "";
    const decoded = decodeJwt(token);
    return decoded?.token ?? null;
}   