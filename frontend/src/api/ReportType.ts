import { Base } from "./Base";
import { Report } from "./types/report-type";

export class ReportType extends Base {
    constructor() {
        const END_POINT = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3010";
        console.log("API Endpoint:", END_POINT);
        super({
            baseURL: END_POINT + "/api/v1/report-types",
        });
    }

    async GetAll(query: {
        page?: number;
        pageSize?: number;

        name?: string;
        year?: number;
        period?: string;
        startDate?: string;
        endDate?: string;
        isActive?: boolean;

    }): Promise<{
        items: Report[],
        count: number,
        pageSize: number,
        pageNumber: number,
    }> {
        const result = await this.execute<{
            items: Report[],
            count: number,
            pageSize: number,
            pageNumber: number,
        }>({
            url: "/admin",
            method: "GET",
            params: query
        });

        if (result.success && result.data) {
            return result.data;
        }

        throw Error("Có lỗi xảy ra vui lòng thử lại sau");
    }

    async CreateReportType(data: {}): Promise<Report> {
        const result = await this.execute<Report>({
            url: "/",
            method: "POST",
            data: data
        });

        if (result.success && result.data) {
            return result.data;
        }

        throw Error("Có lỗi xảy ra vui lòng thử lại sau");
    }

    async UpdateReportType(id: number, data: {}): Promise<void> {
        const result = await this.execute<Report>({
            url: `/${id}`,
            method: "PUT",
            data: data
        });
        
        if (result.success) {
            return;
        }

        throw Error("Có lỗi xảy ra vui lòng thử lại sau");
    }
}