import { Base } from "./Base";
import { AgreementTable } from "./types/agreement";

type IReport = {
    items: AgreementTable[];
    pageNumber: number;
    pageSize: number;
    total: number;
}

export class Report extends Base {
    constructor() {
        const END_POINT = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3010";
        super({
            baseURL: END_POINT + "/api/v1/reports",
        });
    }

    async GetAll(query: {}): Promise<IReport> {
        const result = await this.execute<IReport>({
            url: "/admin",
            params: query
        });

        if (result.success && result.data) {
            return result.data
        }

        throw Error("Lỗi khi lấy dữ liệu");
    }
}