import { Base } from "./Base";

export interface IInjuryType {
    id: number;
    code: string;
    name: string;
    isActive: boolean;
    parentId?: number | null;
    parent?: IInjuryType | null;
    children?: IInjuryType[];
    level?: number;
    levelText?: string;
    deletedAt?: string;
}

export interface IInjuryTypeListResponse {
    items: IInjuryType[];
    count: number;
    pageSize: number;
    pageNumber: number;
}

export class InjuryTypeApi extends Base {
    constructor() {
        let END_POINT = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3010";
        if (END_POINT.endsWith("/")) {
            END_POINT = END_POINT.slice(0, -1);
        }
        super({
            baseURL: END_POINT + "/api/v1/injury-types",
        });
    }

    async getAllForAdmin(query: {
        page?: number;
        pageSize?: number;
        code?: string;
        name?: string;
        level?: number;
        isActive?: boolean;
    }): Promise<{ success: boolean; message: string; data?: IInjuryTypeListResponse }> {
        const result = await this.execute<IInjuryTypeListResponse>({
            url: "/admin",
            method: "GET",
            params: query,
        });

        return {
            success: result.success,
            message: result.message || "Có lỗi xảy ra khi lấy danh sách loại chấn thương",
            data: result.data ?? undefined,
        };
    }

    async getAllForBusiness(query: {
        page?: number;
        pageSize?: number;
        code?: string;
        name?: string;
        level?: number;
        isActive?: boolean;
    }): Promise<{ success: boolean; message: string; data?: IInjuryTypeListResponse }> {
        const result = await this.execute<IInjuryTypeListResponse>({
            url: "/app",
            method: "GET",
            params: query,
        });

        return {
            success: result.success,
            message: result.message || "Có lỗi xảy ra khi lấy danh sách loại chấn thương",
            data: result.data ?? undefined,
        };
    }

    async create(dto: {
        code: string;
        name: string;
        isActive?: boolean;
        parentId?: number | null;
    }): Promise<{ success: boolean; message: string; data?: IInjuryType }> {
        const result = await this.execute<IInjuryType>({
            url: "",
            method: "POST",
            data: dto,
        });

        return {
            success: result.success,
            message: result.message || "Có lỗi xảy ra khi tạo loại chấn thương",
            data: result.data ?? undefined,
        };
    }

    async update(id: number, dto: {
        code?: string;
        name?: string;
        parentId?: number | null;
        isActive?: boolean;
    }): Promise<{ success: boolean; message: string; data?: IInjuryType }> {
        const result = await this.execute<IInjuryType>({
            url: `/${id}`,
            method: "PUT",
            data: dto,
        });

        return {
            success: result.success,
            message: result.message || "Có lỗi xảy ra khi cập nhật loại chấn thương",
            data: result.data ?? undefined,
        };
    }

    async toggleActive(id: number, isActive: boolean): Promise<{ success: boolean; message: string }> {
        const result = await this.execute({
            url: `/${id}/toggle-active`,
            method: "PATCH",
            data: { isActive },
        });

        return {
            success: result.success,
            message: result.message || "Có lỗi xảy ra khi thay đổi trạng thái hoạt động",
        };
    }

    async bulkDelete(ids: number[]): Promise<{ success: boolean; message: string }> {
        const result = await this.execute({
            url: "/bulk-delete",
            method: "POST",
            data: { ids },
        });

        return {
            success: result.success,
            message: result.message || "Có lỗi xảy ra khi xóa loại chấn thương",
        };
    }

    async getDetail(id: number): Promise<{ success: boolean; message: string; data?: IInjuryType }> {
        const result = await this.execute<IInjuryType>({
            url: `/${id}`,
            method: "GET",
        });

        return {
            success: result.success,
            message: result.message || "Có lỗi xảy ra khi lấy chi tiết loại chấn thương",
            data: result.data ?? undefined,
        };
    }
}
