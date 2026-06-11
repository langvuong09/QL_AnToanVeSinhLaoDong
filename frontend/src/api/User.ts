import { Base } from "./Base";

export class User extends Base {
    constructor() {
        const END_POINT = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3000";
        super({
            baseURL: END_POINT + "/users",
        });
    }

    async ChangePassword(oldPassword: string, newPassword: string, confirmPassword: string): Promise<{ success: boolean; message: string }> {
        const result = await this.execute({
            url: "/reset-password",
            method: "POST",
            data: { oldPassword, newPassword, confirmPassword },
        });

        return {
            success: result.success,
            message: result.message || "Có lỗi xảy ra khi đổi mật khẩu",
        };
    }
}
