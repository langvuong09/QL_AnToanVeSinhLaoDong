import { IsNotEmpty, IsString, IsInt, IsArray, IsOptional, ValidateNested, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ReportDetailDto {
  @ApiProperty({ example: 1, description: 'ID của danh mục Yếu tố chấn thương (TRAUMA). Truyền null nếu là dòng Loại chấn thương', required: false, nullable: true })
  @IsOptional()
  @IsInt()
  traumaId?: number;

  @ApiProperty({ example: null, description: 'ID của danh mục Loại chấn thương (INJURY). Truyền null nếu là dòng Yếu tố chấn thương', required: false, nullable: true })
  @IsOptional()
  @IsInt()
  injuryTypeId?: number;

  // --- Nhóm số liệu thống kê về Vụ/Người ---
  @ApiProperty({ example: 5, description: 'Tổng số vụ tai nạn lao động', default: 0 })
  @IsOptional() @IsInt() @Min(0)
  totalCases?: number;

  @ApiProperty({ example: 1, description: 'Số vụ tai nạn chết người', default: 0 })
  @IsOptional() @IsInt() @Min(0)
  fatalCases?: number;

  @ApiProperty({ example: 0, description: 'Số vụ tai nạn có nhiều người bị nạn', default: 0 })
  @IsOptional() @IsInt() @Min(0)
  multiVictimCases?: number;

  @ApiProperty({ example: 5, description: 'Tổng số người bị nạn', default: 0 })
  @IsOptional() @IsInt() @Min(0)
  totalVictims?: number;

  @ApiProperty({ example: 2, description: 'Số người bị nạn là nữ', default: 0 })
  @IsOptional() @IsInt() @Min(0)
  femaleVictims?: number;

  @ApiProperty({ example: 1, description: 'Số người chết', default: 0 })
  @IsOptional() @IsInt() @Min(0)
  fatalVictims?: number;

  @ApiProperty({ example: 2, description: 'Số người bị thương nặng', default: 0 })
  @IsOptional() @IsInt() @Min(0)
  severeInjuries?: number;

  // --- Nhóm thống kê đối tượng không thuộc quản lý ---
  @ApiProperty({ example: 0, description: 'Tổng số người bị nạn không thuộc diện quản lý', default: 0 })
  @IsOptional() @IsInt() @Min(0)
  nonManagedVictims?: number;

  @ApiProperty({ example: 0, description: 'Số người bị nạn là nữ không thuộc diện quản lý', default: 0 })
  @IsOptional() @IsInt() @Min(0)
  nonManagedFemaleVictims?: number;

  @ApiProperty({ example: 0, description: 'Số người chết không thuộc diện quản lý', default: 0 })
  @IsOptional() @IsInt() @Min(0)
  nonManagedFatalVictims?: number;

  @ApiProperty({ example: 0, description: 'Số người bị thương nặng không thuộc diện quản lý', default: 0 })
  @IsOptional() @IsInt() @Min(0)
  nonManagedSevereInjuries?: number;

  // --- Nhóm số liệu tài chính ---
  @ApiProperty({ example: 15000000, description: 'Chi phí y tế (VND)', default: 0 })
  @IsOptional() @IsNumber() @Min(0)
  medicalCost?: number;

  @ApiProperty({ example: 30000000, description: 'Chi phí bồi thường lương, trợ cấp (VND)', default: 0 })
  @IsOptional() @IsNumber() @Min(0)
  salaryCompensation?: number;

  @ApiProperty({ example: 5000000, description: 'Giá trị thiệt hại về tài sản (VND)', default: 0 })
  @IsOptional() @IsNumber() @Min(0)
  propertyDamage?: number;
}

export class CreateReportDto {
  @ApiProperty({ example: 'Báo cáo tình hình tai nạn lao động 6 tháng đầu năm 2026', description: 'Tiêu đề của bản báo cáo' })
  @IsNotEmpty({ message: 'Tiêu đề báo cáo không được để trống' })
  @IsString()
  title!: string;

  @ApiProperty({ example: 2026, description: 'Năm thống kê dữ liệu' })
  @IsNotEmpty({ message: 'Năm báo cáo không được để trống' })
  @IsInt()
  @Min(2000)
  year!: number;

  @ApiProperty({ example: 1, description: 'ID cấu hình loại báo cáo (kỳ báo cáo)' })
  @IsNotEmpty({ message: 'Mã loại báo cáo không được để trống' })
  @IsInt()
  reportTypeId!: number;
  
  @ApiProperty({ type: [ReportDetailDto], description: 'Mảng danh sách các hàng số liệu chi tiết của biểu mẫu' })
  @IsNotEmpty({ message: 'Danh sách chi tiết biểu mẫu số liệu không được để trống' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReportDetailDto)
  details!: ReportDetailDto[];

  @ApiProperty({ example: ['uuid-file-1', 'uuid-file-2'], description: 'Danh sách ID file đính kèm (nếu có)', required: false, default: [] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fileIds?: string[];
}