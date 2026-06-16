import { Base } from "./Base";
import { AuthData } from "./types/auth";

export class Auth extends Base {
    constructor() {
        const END_POINT = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3010";
        console.log("API Endpoint:", END_POINT);
        super({
            baseURL: END_POINT + "/api/v1/auth",
        });
    }

    async Login(username: string, password: string): Promise<AuthData> {
        const result = await this.execute<AuthData>({
            url: "/login",
            method: "POST",
            data: { username: username, password: password }
        });

        if (result?.data && result?.success) {
            return result.data;
        }
        else {
            throw Error(result.message === "Account is locked" ? "Tài khoản bị khóa" : "Thông tin đăng nhập không chính xác");
        }
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