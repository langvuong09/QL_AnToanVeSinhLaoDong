import { Base } from "./Base";

export class Agreement extends Base {
    constructor() {
        const END_POINT = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3010";
        console.log("API Endpoint:", END_POINT);
        super({
            baseURL: END_POINT + "/api/v1/reports",
        });
    }

    async GetAll(query: {}) {
        const result = await this.execute({
            url: "/my-reports",
            method: "GET",
            params: query
        });

        console.log(result);
    }
}