import { Base } from "./Base";
import { UserDetail } from "./types/user";

export interface IUser {
    id: string;
    fullName: string;
    username: string;
    email: string;
    position: string;
    status: boolean;
    role: {
        id: number;
        name: string;
    };
}

export interface IUserListResponse {
    items: IUser[];
    count: number;
    pageSize: number;
    pageNumber: number;
}

export type ElementAddress = {
    key: number;
    value: string;
}

export class User extends Base {
    constructor() {
        const END_POINT = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3010";
        super({
            baseURL: END_POINT + "/api/v1/users",
        });
    }

    async getAll(query: {
        page?: number;
        pageSize?: number;
        fullName?: string;
        username?: string;
        email?: string;
        roleId?: number;
        position?: string;
        status?: boolean;
    }): Promise<{ success: boolean; message: string; data?: IUserListResponse }> {
        const result = await this.execute<IUserListResponse>({
            url: "/",
            method: "GET",
            params: query,
        });

        return {
            success: result.success,
            message: result.message || "Có lỗi xảy ra khi lấy danh sách người dùng",
            data: result.data ?? undefined,
        };
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

    async toggleStatus(id: string, status: boolean): Promise<{ success: boolean; message: string }> {
        const result = await this.execute({
            url: `/${id}/status`,
            method: "PATCH",
            data: { status },
        });

        return {
            success: result.success,
            message: result.message || "Co loi xay ra khi thay doi trang thai nguoi dung",
        };
    }

    async GetUserDetailById(id: string): Promise<UserDetail> {
        const result = await this.execute<UserDetail>({
            url: `/${id}`,
            method: "GET",
        });

        return result.data!;
    }

    async UpdateSelfProfile(id: string,data: {
        fullName?: string;
        dateOfBirth?: string;
        gender?: string;

        province?: ElementAddress;
        ward?: ElementAddress;
        address?: string;

        roleId?: number;
        position?: string;
        status?: boolean;
        avatarId?: string;
    }) {
        const result = await this.execute({
            url: `/${id}/profile`,
            method: "PUT",
            data: data,
        });
        return result;
    }
}
