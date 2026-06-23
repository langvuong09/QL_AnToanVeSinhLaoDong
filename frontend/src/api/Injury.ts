import { Base } from "./Base";
import { InjuryDto } from "./types/Injury";

type IInjury = {
    items: InjuryDto[];
}

export class Injury extends Base {
    constructor() {
        const END_POINT = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3010";
        console.log("API Endpoint:", END_POINT);
        super({
            baseURL: END_POINT + "/api/v1/injury-types",
        });
    }

    async GetAll(): Promise<InjuryDto[]> {
        const result = await this.execute<IInjury>({
            url: "/admin",
            method: "GET"
        });

        return result.data?.items || [];
    }
}