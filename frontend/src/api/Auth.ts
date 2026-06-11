import { Base } from "./Base";
import { AuthData } from "./types/auth";

export class Auth extends Base {
    constructor() {
        const END_POINT = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3000";
        console.log("API Endpoint:", END_POINT);
        super({
            baseURL: END_POINT + "/auth",
        });
    }

    async Login(username: string, password: string): Promise<AuthData> {
        try {
            const result = await this.execute<AuthData>({
                url: "/login",
                method: "POST",
                data: { username: username, password: password }
            });

            if (result?.data) {
                return result.data;
            }
        } catch {
            throw Error("Thông tin đăng nhập không chính xác");
        }

        throw Error("Lỗi không xác định vui lòng thử lại sau");
    }

    async Logout(): Promise<void> {
        const _ = await this.execute({
            url: "/logout",
            method: "POST"
        });
    }

    async ForgotPassword(email: string): Promise<{ success: boolean; message: string }> {
        const result = await this.execute({
            url: "/forgot-password",
            method: "POST",
            data: { email }
        });
        return { success: result.success, message: result.message || "" };
    }

    async VerifyOtp(email: string, otp: string): Promise<{ success: boolean; message: string; resetToken?: string }> {
        const result = await this.execute<{ resetToken: string }>({
            url: "/verify-otp",
            method: "POST",
            data: { email, otp }
        });
        return {
            success: result.success,
            message: result.message || "",
            resetToken: result.data?.resetToken
        };
    }

    async ResetPassword(token: string, newPassword: string, confirmPassword: string): Promise<{ success: boolean; message: string }> {
        const result = await this.execute({
            url: "/reset-password",
            method: "POST",
            data: { token, newPassword, confirmPassword }
        });
        return { success: result.success, message: result.message || "" };
    }
}