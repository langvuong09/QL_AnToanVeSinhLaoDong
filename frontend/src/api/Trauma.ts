import { Base } from "./Base";
import { TrauMaDto } from "./types/trauma";

type ITrauMa = {
    
    items: TrauMaDto[];
}

export class TrauMa extends Base {
    constructor() {
        const END_POINT = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3010";
        console.log("API Endpoint:", END_POINT);
        super({
            baseURL: END_POINT + "/api/v1/trauma-factors",
        });
    }

    async GetAll(): Promise<TrauMaDto[]> {
        const result = await this.execute<ITrauMa>({
            url: "/",
            method: "GET"
        });

        return result.data?.items || [];
    }
}