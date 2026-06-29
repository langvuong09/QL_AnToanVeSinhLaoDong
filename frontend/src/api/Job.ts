import { Base } from "./Base";

export interface IJob {
    id: number;
    code: string;
    name: string;
    isActive: boolean;
    parentId?: number | null;
    parent?: IJob | null;
    children?: IJob[];
    level?: number;
    levelText?: string;
    deletedAt?: string;
}

export interface IJobListResponse {
    items: IJob[];
    count: number;
    pageSize: number;
    pageNumber: number;
}

export class Job extends Base {
    constructor() {
        let END_POINT = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3010";
        if (END_POINT.endsWith("/")) {
            END_POINT = END_POINT.slice(0, -1);
        }
        super({
            baseURL: END_POINT + "/api/v1/jobs",
        });
    }

    async GetAll(): Promise<any[]> {
        const result = await this.execute<IJobListResponse>({
            url: "/admin",
            method: "GET",
            params: {
                page: 1,
                pageSize: 1000,
            }
        });
        return result.data?.items || [];
    }

    async getAllForAdmin(query: {
        page?: number;
        pageSize?: number;
        code?: string;
        name?: string;
        level?: number;
        isActive?: boolean;
    }): Promise<{ success: boolean; message: string; data?: IJobListResponse }> {
        const result = await this.execute<IJobListResponse>({
            url: "/admin",
            method: "GET",
            params: query,
        });

        return {
            success: result.success,
            message: result.message || "Có lỗi xảy ra khi lấy danh sách nghề nghiệp",
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
    }): Promise<{ success: boolean; message: string; data?: IJobListResponse }> {
        const result = await this.execute<IJobListResponse>({
            url: "",
            method: "GET",
            params: query,
        });

        return {
            success: result.success,
            message: result.message || "Có lỗi xảy ra khi lấy danh sách nghề nghiệp",
            data: result.data ?? undefined,
        };
    }

    async create(dto: {
        code: string;
        name: string;
        isActive?: boolean;
        parentId?: number | null;
    }): Promise<{ success: boolean; message: string; data?: IJob }> {
        const result = await this.execute<IJob>({
            url: "",
            method: "POST",
            data: dto,
        });

        return {
            success: result.success,
            message: result.message || "Có lỗi xảy ra khi tạo nghề nghiệp",
            data: result.data ?? undefined,
        };
    }

    async update(id: number, dto: {
        code?: string;
        name?: string;
        parentId?: number | null;
        isActive?: boolean;
    }): Promise<{ success: boolean; message: string; data?: IJob }> {
        const result = await this.execute<IJob>({
            url: `/${id}`,
            method: "PUT",
            data: dto,
        });

        return {
            success: result.success,
            message: result.message || "Có lỗi xảy ra khi cập nhật nghề nghiệp",
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
            message: result.message || "Có lỗi xảy ra khi xóa nghề nghiệp",
        };
    }

    async getDetail(id: number): Promise<{ success: boolean; message: string; data?: IJob }> {
        const result = await this.execute<IJob>({
            url: `/${id}`,
            method: "GET",
        });

        return {
            success: result.success,
            message: result.message || "Có lỗi xảy ra khi lấy chi tiết nghề nghiệp",
            data: result.data ?? undefined,
        };
    }
}

export const JobApi = Job;
export type JobApi = Job;