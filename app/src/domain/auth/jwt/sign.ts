import jwt from "jsonwebtoken";
import { JwtPayload } from "../types";

export const signJwt = (payload: JwtPayload) => {
    return jwt.sign(payload, process.env.JWT_SECRET!);
}

export const verifyJwt = (token: string) => {
    return jwt.verify(token, process.env.JWT_SECRET!);
}

export const decodeJwt = (token: string) => {
    if (!jwt.verify(token, process.env.JWT_SECRET!)) {
        return null;
    }
    return jwt.decode(token) as JwtPayload;
}