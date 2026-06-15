import { Base } from "./Base";
import type { IBusinessType } from "./BusinessType";
import type { IIndustry } from "./Industry";
import type { MediaUpload } from "./types/media";
import type { ElementAddress } from "./User";

export interface IDoet {
    id: number;
    name: string;
    taxCode: string;
    issuedDate: string;
    status: boolean;
    businessTypeId: number;
    businessType?: IBusinessType;
    industryId: number;
    industry?: IIndustry;
    foreignName?: string;
    representative?: string;
    repPhone?: string;
    phone?: string;
    address?: string;
    quarter?: string;
    province?: ElementAddress;
    district?: ElementAddress;
    ward?: ElementAddress;
    files?: MediaUpload[];
}

export interface IDoetUser {
    id: string;
    username: string;
    fullName?: string;
    email?: string;
    position?: string;
    status: boolean;
    address?: string;
    quarter?: string;
    province?: ElementAddress;
    district?: ElementAddress;
    ward?: ElementAddress;
    doet: IDoet;
}

export interface IDoetListResponse {
    items: IDoetUser[];
    count: number;
    pageSize: number;
    pageNumber: number;
}

export type DoetPayload = {
    name: string;
    taxCode?: string;
    issuedDate: string;
    businessTypeId: number;
    industryId: number;
    foreignName?: string;
    representative?: string;
    repPhone?: string;
    phone?: string;
    email?: string;
    address?: string;
    quarter?: string;
    province: ElementAddress;
    district: ElementAddress;
    ward: ElementAddress;
}

export class DoetApi extends Base {
    constructor() {
        let END_POINT = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3010";
        if (END_POINT.endsWith("/")) {
            END_POINT = END_POINT.slice(0, -1);
        }
        super({
            baseURL: END_POINT + "/api/v1/doets",
        });
    }

    async getAll(query: {
        page?: number;
        pageSize?: number;
        name?: string;
        taxCode?: string;
        businessTypeId?: number;
        industryId?: number;
        ward?: string;
        status?: string;
    }): Promise<{ success: boolean; message: string; data?: IDoetListResponse }> {
        const result = await this.execute<IDoetListResponse>({
            url: "",
            method: "GET",
            params: query,
        });

        return {
            success: result.success,
            message: result.message || "Có lỗi xảy ra khi lấy danh sách doanh nghiệp",
            data: result.data ?? undefined,
        };
    }

    async getDetail(id: number): Promise<{ success: boolean; message: string; data?: IDoetUser }> {
        const result = await this.execute<IDoetUser>({
            url: `/${id}`,
            method: "GET",
        });

        return {
            success: result.success,
            message: result.message || "Có lỗi xảy ra khi lấy chi tiết doanh nghiệp",
            data: result.data ?? undefined,
        };
    }

    async create(dto: DoetPayload): Promise<{ success: boolean; message: string; data?: IDoet }> {
        const result = await this.execute<IDoet>({
            url: "",
            method: "POST",
            data: dto,
        });

        return {
            success: result.success,
            message: result.message || "Có lỗi xảy ra khi tạo doanh nghiệp",
            data: result.data ?? undefined,
        };
    }

    async update(id: number, dto: Omit<DoetPayload, "taxCode">): Promise<{ success: boolean; message: string; data?: IDoet }> {
        const result = await this.execute<IDoet>({
            url: `/${id}`,
            method: "PUT",
            data: dto,
        });

        return {
            success: result.success,
            message: result.message || "Có lỗi xảy ra khi cập nhật doanh nghiệp",
            data: result.data ?? undefined,
        };
    }

    async toggleStatus(id: number, status: boolean): Promise<{ success: boolean; message: string }> {
        const result = await this.execute({
            url: `/${id}/status`,
            method: "PATCH",
            data: { status },
        });

        return {
            success: result.success,
            message: result.message || "Có lỗi xảy ra khi thay đổi trạng thái doanh nghiệp",
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
            message: result.message || "Có lỗi xảy ra khi xóa doanh nghiệp",
        };
    }

    async removeFile(fileId: string): Promise<{ success: boolean; message: string }> {
        const result = await this.execute({
            url: `/files/${fileId}`,
            method: "DELETE",
        });

        return {
            success: result.success,
            message: result.message || "Có lỗi xảy ra khi xóa file",
        };
    }
}
