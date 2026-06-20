import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateReportDto, ReportDetailDto } from './create-report.dto';
import { IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateReportDetailDto extends PartialType(ReportDetailDto) {}

export class UpdateReportDto extends PartialType(CreateReportDto) {
  @ApiProperty({ type: [UpdateReportDetailDto], description: 'Danh sách chi tiết biểu mẫu báo cáo' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateReportDetailDto)
  details?: UpdateReportDetailDto[];
}