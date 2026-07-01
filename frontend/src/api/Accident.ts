import { Base } from "./Base";

export interface IAccidentCause {
    id: number;
    code: string;
    name: string;
    type: 'EMPLOYER' | 'EMPLOYEE';
    isActive: boolean;
    deletedAt?: string;
}

export interface IAccidentCauseListResponse {
    items: IAccidentCause[];
    count: number;
    pageSize: number;
    pageNumber: number;
}

export class Accident extends Base {
    constructor() {
        let END_POINT = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3010";
        if (END_POINT.endsWith("/")) {
            END_POINT = END_POINT.slice(0, -1);
        }
        super({
            baseURL: END_POINT + "/api/v1/accident-causes",
        });
    }

    async GetAll(): Promise<IAccidentCause[]> {
        const result = await this.execute<IAccidentCauseListResponse>({
            url: "/admin",
            method: "GET",
            params: { page: 1, pageSize: 1000, isActive: true },
        });
        return result.data?.items || [];
    }

    async getAllForAdmin(query: {
        page?: number;
        pageSize?: number;
        code?: string;
        name?: string;
        type?: 'EMPLOYER' | 'EMPLOYEE';
        isActive?: boolean;
    }): Promise<{ success: boolean; message: string; data?: IAccidentCauseListResponse }> {
        const result = await this.execute<IAccidentCauseListResponse>({
            url: "/admin",
            method: "GET",
            params: query,
        });

        return {
            success: result.success,
            message: result.message || "Có lỗi xảy ra khi lấy danh sách nguyên nhân tai nạn lao động",
            data: result.data ?? undefined,
        };
    }

    async getAllForBusiness(query: {
        page?: number;
        pageSize?: number;
        code?: string;
        name?: string;
        type?: 'EMPLOYER' | 'EMPLOYEE';
        isActive?: boolean;
    }): Promise<{ success: boolean; message: string; data?: IAccidentCauseListResponse }> {
        const result = await this.execute<IAccidentCauseListResponse>({
            url: "/business",
            method: "GET",
            params: query,
        });

        return {
            success: result.success,
            message: result.message || "Có lỗi xảy ra khi lấy danh sách nguyên nhân tai nạn lao động",
            data: result.data ?? undefined,
        };
    }

    async create(dto: {
        code: string;
        name: string;
        type: 'EMPLOYER' | 'EMPLOYEE';
        isActive?: boolean;
    }): Promise<{ success: boolean; message: string; data?: IAccidentCause }> {
        const result = await this.execute<IAccidentCause>({
            url: "",
            method: "POST",
            data: dto,
        });

        return {
            success: result.success,
            message: result.message || "Có lỗi xảy ra khi tạo nguyên nhân tai nạn lao động",
            data: result.data ?? undefined,
        };
    }

    async update(id: number, dto: {
        code?: string;
        name?: string;
        type?: 'EMPLOYER' | 'EMPLOYEE';
    }): Promise<{ success: boolean; message: string; data?: IAccidentCause }> {
        const result = await this.execute<IAccidentCause>({
            url: `/${id}`,
            method: "PUT",
            data: dto,
        });

        return {
            success: result.success,
            message: result.message || "Có lỗi xảy ra khi cập nhật nguyên nhân tai nạn lao động",
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
            message: result.message || "Có lỗi xảy ra khi xóa nguyên nhân tai nạn lao động",
        };
    }

    async getDetail(id: number): Promise<{ success: boolean; message: string; data?: IAccidentCause }> {
        const result = await this.execute<IAccidentCause>({
            url: `/${id}`,
            method: "GET",
        });

        return {
            success: result.success,
            message: result.message || "Có lỗi xảy ra khi lấy chi tiết nguyên nhân tai nạn lao động",
            data: result.data ?? undefined,
        };
    }
}

export const AccidentApi = Accident;
export type AccidentApi = Accident;