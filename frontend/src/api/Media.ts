import { Base } from "./Base";
import { MediaUpload } from "./types/media";

export class Media extends Base {
    constructor() {
        const END_POINT = process.env.NEXT_PUBLIC_API_ENDPOINT || "http://localhost:3010";
        super({
            baseURL: END_POINT + "/api/v1/media",
        });
    }

    async UploadImage(data: FormData): Promise<{ success: boolean; message: string; data?: MediaUpload }> {
        const result = await this.execute<MediaUpload>({
            url: "/upload",
            method: "POST",
            data: data
        });

        return {
            success: result.success,
            message: result.message || "Có lỗi xảy ra khi upload file",
            data: result.data ?? undefined,
        };
    }

    async deleteFile(id: string): Promise<{ success: boolean; message: string }> {
        const result = await this.execute({
            url: `/${id}`,
            method: "DELETE",
        });

        return {
            success: result.success,
            message: result.message || "Có lỗi xảy ra khi xóa file",
        };
    }

    async getDownloadUrl(id: string): Promise<{ success: boolean; message: string; data?: { url: string } }> {
        const result = await this.execute<{ url: string }>({
            url: `/${id}/download`,
            method: "GET",
        });

        return {
            success: result.success,
            message: result.message || "Có lỗi xảy ra khi lấy đường dẫn tải file",
            data: result.data ?? undefined,
        };
    }
}
