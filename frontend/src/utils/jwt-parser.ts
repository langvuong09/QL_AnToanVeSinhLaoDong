import { jwtDecode } from "jwt-decode";
import { Jwt } from "../api/types/jwt";

export const parseAccessToken = (accessToken: string): Jwt | null => {
    if (!accessToken) return null;

    return jwtDecode(accessToken);
}
