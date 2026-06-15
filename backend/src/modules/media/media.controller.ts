import { 
  Controller, 
  Post, 
  Delete, 
  Get, 
  Param, 
  UploadedFile, 
  UseInterceptors, 
  Body, 
  ParseUUIDPipe, 
  UploadedFiles
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { MediaService } from "./media.service";
import { FileType } from "./media.model";
import Response from 'src/commons/response'; // Điều chỉnh đường dẫn theo dự án của bạn
import { ApiConsumes } from "@nestjs/swagger";
import { ApiBody } from "@nestjs/swagger";

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data') 
  @ApiBody({ 
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        fileType: { 
          type: 'string', 
          enum: Object.values(FileType),
          description: 'Loại file (GPKD, AVATAR, REPORT_ATTACHMENT, OTHER)' 
        },
        doetId: { type: 'number' , nullable: true },
      },
    },
  })
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('fileType') fileType: FileType,
    @Body('doetId') doetId?: number,
  ) {
    const data = await this.mediaService.uploadFile(file, fileType, doetId);
    return Response.get(data);
  }

  @Get(':id/download')
  async getDownloadUrl(@Param('id', ParseUUIDPipe) id: string) {
    const url = await this.mediaService.getDownloadUrl(id);
    return Response.get({ url });
  }

  @Delete(':id')
  async deleteFile(@Param('id', ParseUUIDPipe) id: string) {
    return await this.mediaService.deleteFile(id);
  }

  @Post('upload-multiple')
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['files', 'fileType'],
      properties: {
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
          description: 'Danh sách các file cần upload'
        },
        fileType: { 
          type: 'string', 
          enum: Object.values(FileType),
          description: 'Loại file áp dụng chung cho danh sách file này' 
        },
        doetId: { type: 'number' , nullable: true },
      },
    },
  })
  async uploadMultipleFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('fileType') fileType: FileType,
    @Body('doetId') doetId?: number,
  ) {
    const data = await this.mediaService.uploadMultipleFiles(files, fileType, doetId);
    return Response.get(data);
  }
}