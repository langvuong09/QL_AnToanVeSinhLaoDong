import { ConfigService } from "@nestjs/config";
import * as AWS from "aws-sdk";
import { ResponseData } from "../../commons/response";
import { UploadResponse } from "./media.model";
export declare class MediaService {
    private readonly configService;
    s3Client: AWS.S3;
    constructor(configService: ConfigService);
    uploadFile(file: any): Promise<ResponseData<UploadResponse>>;
    generateUrl(key: string): Promise<any>;
}
