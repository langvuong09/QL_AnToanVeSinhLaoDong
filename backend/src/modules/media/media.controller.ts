import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/commons/guards/authGuard';
import { FileUploadDto, UploadResponse } from './media.model';
import { MediaService } from './media.service';
import ResponseInterceptor from 'src/interceptors/response.interceptor';
import { ResponseData } from 'src/commons/response';
@ApiTags('Media')
@Controller('common/media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseGuards(AuthGuard)
  @UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
  })
  async uploadFile(
    @UploadedFile() file,
  ): Promise<ResponseData<UploadResponse>> {
    return this.mediaService.uploadFile(file);
  }

  @Get('url')
  @UseGuards(AuthGuard)
  @UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Generate public url' })
  async downloadFile(@Query('key') key: string): Promise<any> {
    return await this.mediaService.generateUrl(key);
  }
}
