import { IsNotEmpty, IsString, IsInt, IsArray, IsOptional, ValidateNested, IsNumber, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { AccidentCauseEnum } from '../../../commons/enums/accident.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ReportDetailDto {
  @ApiProperty({ description: 'Nguyên nhân tai nạn', enum: AccidentCauseEnum, enumName: 'AccidentCauseEnum' })
  @IsOptional() @IsEnum(AccidentCauseEnum) cause?: AccidentCauseEnum;

  @ApiProperty({ description: 'ID Yếu tố chấn thương', example: 1, required: false })
  @IsOptional() @IsInt() traumaId?: number;

  @ApiProperty({ description: 'ID Loại thương tích', example: 1, required: false })
  @IsOptional() @IsInt() injuryTypeId?: number;

  @ApiProperty({ description: 'Tổng số vụ', example: 0, required: false })
  @IsOptional() @IsInt() @Min(0) totalCases?: number;

  @ApiProperty({ description: 'Số vụ chết người', example: 0, required: false })
  @IsOptional() @IsInt() @Min(0) fatalCases?: number;

  @ApiProperty({ description: 'Số vụ có nhiều nạn nhân', example: 0, required: false })
  @IsOptional() @IsInt() @Min(0) multiVictimCases?: number;

  @ApiProperty({ description: 'Tổng số nạn nhân', example: 0, required: false })
  @IsOptional() @IsInt() @Min(0) totalVictims?: number;

  @ApiProperty({ description: 'Số nạn nhân nữ', example: 0, required: false })
  @IsOptional() @IsInt() @Min(0) femaleVictims?: number;

  @ApiProperty({ description: 'Số nạn nhân chết người', example: 0, required: false })
  @IsOptional() @IsInt() @Min(0) fatalVictims?: number;

  @ApiProperty({ description: 'Số ca thương tích nặng', example: 0, required: false })
  @IsOptional() @IsInt() @Min(0) severeInjuries?: number;

  @ApiProperty({ description: 'Nạn nhân ngoài quản lý', example: 0, required: false })
  @IsOptional() @IsInt() @Min(0) nonManagedVictims?: number;

  @ApiProperty({ description: 'Nạn nhân nữ ngoài quản lý', example: 0, required: false })
  @IsOptional() @IsInt() @Min(0) nonManagedFemaleVictims?: number;

  @ApiProperty({ description: 'Nạn nhân tử vong ngoài quản lý', example: 0, required: false })
  @IsOptional() @IsInt() @Min(0) nonManagedFatalVictims?: number;

  @ApiProperty({ description: 'Thương tích nặng ngoài quản lý', example: 0, required: false })
  @IsOptional() @IsInt() @Min(0) nonManagedSevereInjuries?: number;

  @ApiProperty({ description: 'Chi phí y tế', example: 0.0, required: false })
  @IsOptional() @IsNumber() @Min(0) medicalCost?: number;

  @ApiProperty({ description: 'Bồi thường lương', example: 0.0, required: false })
  @IsOptional() @IsNumber() @Min(0) salaryCompensation?: number;

  @ApiProperty({ description: 'Thiệt hại tài sản', example: 0.0, required: false })
  @IsOptional() @IsNumber() @Min(0) propertyDamage?: number;

  @ApiProperty({ description: 'Tổng chi phí', example: 0.0, required: false })
  @IsOptional() @IsNumber() @Min(0) totalCost?: number;

  @ApiProperty({ description: 'Tổng số ngày nghỉ vì TNLĐ', example: 0, required: false })
  @IsOptional() @IsInt() @Min(0) totalLeaveDays?: number;

  @ApiProperty({ description: 'Tổng thiệt hại', example: 0.0, required: false })
  @IsOptional() @IsNumber() @Min(0) totalDamage?: number;
}

export class CreateReportDto {
  @ApiProperty({ example: 'Báo cáo tai nạn lao động năm 2026', description: 'Tiêu đề báo cáo' })
  @IsNotEmpty() @IsString() title!: string;

  @ApiProperty({ example: 2026, description: 'Năm thực hiện báo cáo' })
  @IsNotEmpty() @IsInt() @Min(2000) year!: number;

  @ApiProperty({ example: 1, description: 'ID cấu hình loại báo cáo (Report Type)' })
  @IsNotEmpty() @IsInt() reportTypeId!: number;

  // === THÔNG TIN LAO ĐỘNG CƠ SỞ ===
  @ApiPropertyOptional({ example: 500, description: 'Tổng số lao động' })
  @IsOptional() @IsInt() @Min(0) totalEmployees?: number;

  @ApiPropertyOptional({ example: 200, description: 'Số lao động nữ' })
  @IsOptional() @IsInt() @Min(0) femaleEmployees?: number;

  @ApiPropertyOptional({ example: 1000000000, description: 'Tổng quỹ lương' })
  @IsOptional() @IsNumber() @Min(0) totalPayroll?: number;

  // === MỤC 1 & 2 (Bổ sung thêm các trường thiếu) ===
  // Lưu ý: Áp dụng logic tương tự cho các trường m1TotalLeaveDays, m1TotalDamage, m2TotalLeaveDays, m2TotalDamage
  @ApiPropertyOptional({ example: 0, description: 'M1: Tổng số ngày nghỉ vì TNLĐ' })
  @IsOptional() @IsInt() @Min(0) m1TotalLeaveDays?: number;

  @ApiPropertyOptional({ example: 0, description: 'M1: Tổng thiệt hại' })
  @IsOptional() @IsNumber() @Min(0) m1TotalDamage?: number;

  @ApiPropertyOptional({ example: 0, description: 'M2: Tổng số ngày nghỉ vì TNLĐ' })
  @IsOptional() @IsInt() @Min(0) m2TotalLeaveDays?: number;

  @ApiPropertyOptional({ example: 0, description: 'M2: Tổng thiệt hại' })
  @IsOptional() @IsNumber() @Min(0) m2TotalDamage?: number;

  // ... (giữ nguyên các field cũ m1TotalCases, m1FatalCases, v.v...)

  @ApiPropertyOptional({ type: [ReportDetailDto], description: 'Danh sách các vụ tai nạn lẻ' })
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => ReportDetailDto)
  details?: ReportDetailDto[];

  @ApiPropertyOptional({ example: ['uuid-1'], description: 'Mảng ID file đính kèm' })
  @IsOptional() @IsArray() @IsString({ each: true })
  fileIds?: string[];
}