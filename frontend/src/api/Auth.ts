import { Base } from "./Base";
import { AuthResponse } from "./types/auth";

export class Auth extends Base {
    constructor() {
        const END_POINT = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3000";
        console.log("API Endpoint:", END_POINT);
        super({
            baseURL: END_POINT + "/auth",
        });
    }

    async Login(username: string, password: string): Promise<AuthResponse> {
        const result = await this.execute<AuthResponse>({
            url: "/login",
            method: "POST",
            data: { username: username, password: password }
        });

        if (result && result.data) {
            return result.data;
        }

        throw Error("Thông tin đăng nhập không chính xác");
    }

    async Logout(): Promise<void> {
        const _ = await this.execute({
            url: "/logout",
            method: "POST"
        });
    }
}