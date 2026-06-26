import { Base } from "./Base";
import { AccidentDto } from "./types/accident";

type IAccident = {
    items: AccidentDto[];
}

export class Accident extends Base {
    constructor() {
        const END_POINT = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3010";
        console.log("API Endpoint:", END_POINT);
        super({
            baseURL: END_POINT + "/api/v1/accident-causes",
        });
    }

    async GetAll(): Promise<AccidentDto[]> {
        const result = await this.execute<IAccident>({
            url: "/admin",
            method: "GET"
        });

        return result.data?.items || [];
    }
}