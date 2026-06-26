import { Base } from "./Base";
import { JobDto } from "./types/job";

type IJob = {

    items: JobDto[];
}

export class Job extends Base {
    constructor() {
        const END_POINT = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3010";
        console.log("API Endpoint:", END_POINT);
        super({
            baseURL: END_POINT + "/api/v1/jobs",
        });
    }

    async GetAll(): Promise<JobDto[]> {
        const result = await this.execute<IJob>({
            url: "/",
            method: "GET"
        });

        return result.data?.items || [];
    }
}