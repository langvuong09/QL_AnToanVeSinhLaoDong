import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ReportStatus } from '../report.entity';

export class BulkUpdateStatusDto {
  @ApiProperty({ example: [1, 2, 3], description: 'Danh sách ID báo cáo cần cập nhật' })
  @IsArray()
  @IsNumber({}, { each: true })
  ids!: number[];

  @ApiProperty({ enum: ReportStatus, example: ReportStatus.APPROVED, description: 'Trạng thái mới muốn cập nhật' })
  @IsEnum(ReportStatus)
  status!: ReportStatus;

  @ApiProperty({ example: 'Phê duyệt hàng loạt bởi Admin', required: false })
  @IsString()
  @IsOptional()
  note?: string;
}