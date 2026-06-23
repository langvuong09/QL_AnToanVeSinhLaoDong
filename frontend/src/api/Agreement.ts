import { Base } from "./Base";
import { AgreementBusiness, AgreementTable } from "./types/agreement";

type IAgreemnent = {
    count: number;
    items: AgreementBusiness[];
    pageNumber: number;
    pageSize: number;
}

export class Agreement extends Base {
    constructor() {
        const END_POINT = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3010";
        console.log("API Endpoint:", END_POINT);
        super({
            baseURL: END_POINT + "/api/v1/reports",
        });
    }

    async GetAll(query: {}): Promise<IAgreemnent> {
        const result = await this.execute<IAgreemnent>({
            url: "/my-reports",
            method: "GET",
            params: query
        });

        if (result.success && result.data) {
            return result.data
        }

        throw Error("Lỗi khi lấy dữ liệu");
    }

    async GetFeTableById(id: string): Promise<AgreementTable> {
        const result = await this.execute<AgreementTable>({
            url: `${id}/fe-table`,
            method: "GET"
        });

        if (result.success && result.data) {
            return result.data;
        }

        throw Error("Lỗi khi lấy dữ liệu");
    }
}