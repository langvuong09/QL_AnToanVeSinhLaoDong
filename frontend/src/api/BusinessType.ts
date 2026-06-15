import { Base } from "./Base";

export interface IBusinessType {
    id: number;
    code: string;
    name: string;
    isActive: boolean;
    deletedAt?: string;
}

export interface IBusinessTypeListResponse {
    items: IBusinessType[];
    count: number;
    pageSize: number;
    pageNumber: number;
}

export class BusinessTypeApi extends Base {
    constructor() {
        let END_POINT = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3010";
        if (END_POINT.endsWith("/")) {
            END_POINT = END_POINT.slice(0, -1);
        }
        super({
            baseURL: END_POINT + "/api/v1/business-types",
        });
    }

    async getAllForAdmin(query: {
        page?: number;
        pageSize?: number;
        code?: string;
        name?: string;
        isActive?: boolean;
    }): Promise<{ success: boolean; message: string; data?: IBusinessTypeListResponse }> {
        const result = await this.execute<IBusinessTypeListResponse>({
            url: "/admin",
            method: "GET",
            params: query,
        });

        return {
            success: result.success,
            message: result.message || "Có lỗi xảy ra khi lấy danh sách loại hình doanh nghiệp",
            data: result.data ?? undefined,
        };
    }

    async getAllForBusiness(query: {
        page?: number;
        pageSize?: number;
        code?: string;
        name?: string;
        isActive?: boolean;
    }): Promise<{ success: boolean; message: string; data?: IBusinessTypeListResponse }> {
        const result = await this.execute<IBusinessTypeListResponse>({
            url: "",
            method: "GET",
            params: query,
        });

        return {
            success: result.success,
            message: result.message || "Có lỗi xảy ra khi lấy danh sách loại hình doanh nghiệp",
            data: result.data ?? undefined,
        };
    }

    async create(dto: {
        code: string;
        name: string;
        isActive?: boolean;
    }): Promise<{ success: boolean; message: string; data?: IBusinessType }> {
        const result = await this.execute<IBusinessType>({
            url: "",
            method: "POST",
            data: dto,
        });

        return {
            success: result.success,
            message: result.message || "Có lỗi xảy ra khi tạo loại hình doanh nghiệp",
            data: result.data ?? undefined,
        };
    }

    async update(id: number, dto: {
        code?: string;
        name?: string;
    }): Promise<{ success: boolean; message: string; data?: IBusinessType }> {
        const result = await this.execute<IBusinessType>({
            url: `/${id}`,
            method: "PUT",
            data: dto,
        });

        return {
            success: result.success,
            message: result.message || "Có lỗi xảy ra khi cập nhật loại hình doanh nghiệp",
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
            message: result.message || "Có lỗi xảy ra khi xóa loại hình doanh nghiệp",
        };
    }
}
