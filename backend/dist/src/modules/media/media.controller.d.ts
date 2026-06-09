import { UploadResponse } from './media.model';
import { MediaService } from './media.service';
import { ResponseData } from "../../commons/response";
export declare class MediaController {
    private readonly mediaService;
    constructor(mediaService: MediaService);
    uploadFile(file: any): Promise<ResponseData<UploadResponse>>;
    downloadFile(key: string): Promise<any>;
}
