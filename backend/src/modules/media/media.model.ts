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
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}

export enum Mimetype {
  png = 'image/png',
  jpeg = 'image/jpeg',
  pdf = 'application/pdf',
  'vnd.openxmlformats-officedocument.wordprocessingml.document' = '.docx',
  'msword' = 'doc',
}
