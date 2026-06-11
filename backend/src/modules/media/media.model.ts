import { ApiProperty } from '@nestjs/swagger';

export class UploadResponse {
  width!: number;
  height!: number;
  format!: string;
  created_at!: string;
  type!: string;
  url!: string;
  secure_url!: string;
  access_mode!: string;
  original_filename!: string;
  public_id!: string;
  public_url!: string;

  constructor(uploadResponse: Partial<UploadResponse>) {
    Object.assign(this, uploadResponse);
  }
}

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary', description: 'Chọn file để upload' })
  file!: any;
}

export enum FileType {
  GPKD = 'GPKD',
  AVATAR = 'AVATAR',
  REPORT_ATTACHMENT = 'REPORT_ATTACHMENT',
  OTHER = 'OTHER',
}

export enum Mimetype {
  PNG = 'image/png',
  JPEG = 'image/jpeg',
  PDF = 'application/pdf',
  DOCX = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  DOC = 'application/msword',
}
