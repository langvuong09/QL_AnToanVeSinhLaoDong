import { Base } from "./Base";

export interface IRole {
    id: number;
    name: string;
    code: string;
}

export interface IRoleListResponse {
    items: IRole[];
}

export class Role extends Base {
    constructor() {
        const END_POINT = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3010";
        super({
            baseURL: END_POINT + "/api/v1/roles",
        });
    }

    async getAll(): Promise<{ success: boolean; message: string; data?: IRoleListResponse }> {
        const result = await this.execute<IRoleListResponse>({
            url: "/",
            method: "GET",
        });

        return {
            success: result.success,
            message: result.message || "Co loi xay ra khi lay danh sach vai tro",
            data: result.data ?? undefined,
        };
    }
}
