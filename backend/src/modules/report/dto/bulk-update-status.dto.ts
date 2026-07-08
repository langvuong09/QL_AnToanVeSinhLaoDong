import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsInt, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ReportStatus } from '../report.entity';
import { Transform, Type } from 'class-transformer';

export class ReportStatusItem {
  @ApiProperty({ example: 1 })
  @IsInt()
  id!: number;

  @ApiProperty({ example: 'Ghi chú cho báo cáo này', required: false })
  @IsString()
  @IsOptional()
  note?: string;
}

export class BulkUpdateStatusDto {
  @ApiProperty({ type: [ReportStatusItem], description: 'Danh sách các báo cáo kèm ghi chú riêng' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReportStatusItem)
  items!: ReportStatusItem[];

  @ApiProperty({ enum: ReportStatus, example: ReportStatus.APPROVED })
  @IsEnum(ReportStatus)
  status!: ReportStatus;
}