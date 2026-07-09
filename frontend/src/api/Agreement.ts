import { Base } from "./Base";
import { AgreementTable, UpdateAgreementData } from "./types/agreement";

type IAgreemnent = {
    items: AgreementTable[];
    pageNumber: number;
    pageSize: number;
    total: number;
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

    async UpdateReportForBussiness(id: any, data: UpdateAgreementData) {
        const result = await this.execute<AgreementTable>({
            url: `${id}`,
            method: "PUT",
            data: data
        });

        if (result.success && result.data) {
            return result.data;
        }

        throw Error("Lỗi khi cập nhật dữ liệu");
    }

    async UpdateBulkStatus(ids: number[], status: string, items?: Array<{id: number; note: string}> | string) {
        // Handle backward compatibility - if items is a string, it's the old note format
        let payload: any;
        
        if (typeof items === 'string') {
            // Old format for backward compatibility
            payload = {
                ids: ids,
                status: status,
                note: items || undefined
            };
        } else if (Array.isArray(items)) {
            // New format with items
            payload = {
                items: items,
                status: status
            };
        } else {
            payload = {
                ids: ids,
                status: status
            };
        }

        const result = await this.execute<any>({
            url: "/bulk/status",
            method: "PUT",
            data: payload
        });

        if (result.success) {
            return true;
        }

        throw Error("Lỗi khi cập nhật dữ liệu");
    }
}