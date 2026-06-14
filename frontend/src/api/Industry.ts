import { Base } from "./Base";

export interface IIndustry {
    id: number;
    code: string;
    name: string;
    isActive: boolean;
    parentId?: number | null;
    parent?: IIndustry | null;
    children?: IIndustry[];
    level: number;
    deletedAt?: string;
}

export interface IIndustryListResponse {
    items: IIndustry[];
    count: number;
    pageSize: number;
    pageNumber: number;
}

export class IndustryApi extends Base {
    constructor() {
        let END_POINT = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3010";
        if (END_POINT.endsWith("/")) {
            END_POINT = END_POINT.slice(0, -1);
        }
        super({
            baseURL: END_POINT + "/api/v1/industries",
        });
    }

    async getAllForAdmin(query: {
        page?: number;
        pageSize?: number;
        code?: string;
        name?: string;
        level?: number;
        isActive?: boolean;
    }): Promise<{ success: boolean; message: string; data?: IIndustryListResponse }> {
        const result = await this.execute<IIndustryListResponse>({
            url: "/admin",
            method: "GET",
            params: query,
        });

        return {
            success: result.success,
            message: result.message || "Có lỗi xảy ra khi lấy danh sách ngành nghề kinh doanh",
            data: result.data ?? undefined,
        };
    }

    async create(dto: {
        code: string;
        name: string;
        isActive?: boolean;
        parentId?: number | null;
    }): Promise<{ success: boolean; message: string; data?: IIndustry }> {
        const result = await this.execute<IIndustry>({
            url: "",
            method: "POST",
            data: dto,
        });

        return {
            success: result.success,
            message: result.message || "Có lỗi xảy ra khi tạo ngành nghề kinh doanh",
            data: result.data ?? undefined,
        };
    }

    async update(id: number, dto: {
        code?: string;
        name?: string;
        parentId?: number | null;
    }): Promise<{ success: boolean; message: string; data?: IIndustry }> {
        const result = await this.execute<IIndustry>({
            url: `/${id}`,
            method: "PUT",
            data: dto,
        });

        return {
            success: result.success,
            message: result.message || "Có lỗi xảy ra khi cập nhật ngành nghề kinh doanh",
            data: result.data ?? undefined,
        };
    }

    async toggleActive(id: number, isActive: boolean): Promise<{ success: boolean; message: string }> {
        const result = await this.execute({
            url: `/${id}/active`,
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
            message: result.message || "Có lỗi xảy ra khi xóa ngành nghề kinh doanh",
        };
    }

    async getDetail(id: number): Promise<{ success: boolean; message: string; data?: IIndustry }> {
        const result = await this.execute<IIndustry>({
            url: `/${id}`,
            method: "GET",
        });

        return {
            success: result.success,
            message: result.message || "Có lỗi xảy ra khi lấy chi tiết ngành nghề kinh doanh",
            data: result.data ?? undefined,
        };
    }
}
