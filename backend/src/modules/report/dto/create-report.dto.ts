import { IsNotEmpty, IsString, IsInt, IsArray, IsOptional, ValidateNested, IsNumber, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AccidentCauseEnum } from '../../../commons/enums/accident.enum';

export class ReportDetailDto {
  @ApiPropertyOptional({ description: 'Nguyên nhân tai nạn', enum: AccidentCauseEnum, enumName: 'AccidentCauseEnum' })
  @IsOptional() @IsEnum(AccidentCauseEnum) cause?: AccidentCauseEnum;

  @ApiPropertyOptional({ description: 'ID Yếu tố chấn thương', example: 1 })
  @IsOptional() @IsInt() traumaId?: number;

  @ApiPropertyOptional({ description: 'ID Loại thương tích', example: 1 })
  @IsOptional() @IsInt() injuryTypeId?: number;

  @ApiPropertyOptional({ description: 'Tổng số vụ', example: 0 })
  @IsOptional() @IsInt() @Min(0) totalCases?: number;

  @ApiPropertyOptional({ description: 'Số vụ chết người', example: 0 })
  @IsOptional() @IsInt() @Min(0) fatalCases?: number;

  @ApiPropertyOptional({ description: 'Số vụ có nhiều nạn nhân', example: 0 })
  @IsOptional() @IsInt() @Min(0) multiVictimCases?: number;

  @ApiPropertyOptional({ description: 'Tổng số nạn nhân', example: 0 })
  @IsOptional() @IsInt() @Min(0) totalVictims?: number;

  @ApiPropertyOptional({ description: 'Số nạn nhân nữ', example: 0 })
  @IsOptional() @IsInt() @Min(0) femaleVictims?: number;

  @ApiPropertyOptional({ description: 'Số nạn nhân chết người', example: 0 })
  @IsOptional() @IsInt() @Min(0) fatalVictims?: number;

  @ApiPropertyOptional({ description: 'Số ca thương tích nặng', example: 0 })
  @IsOptional() @IsInt() @Min(0) severeInjuries?: number;

  @ApiPropertyOptional({ description: 'Nạn nhân ngoài quản lý', example: 0 })
  @IsOptional() @IsInt() @Min(0) nonManagedVictims?: number;

  @ApiPropertyOptional({ description: 'Nạn nhân nữ ngoài quản lý', example: 0 })
  @IsOptional() @IsInt() @Min(0) nonManagedFemaleVictims?: number;

  @ApiPropertyOptional({ description: 'Nạn nhân tử vong ngoài quản lý', example: 0 })
  @IsOptional() @IsInt() @Min(0) nonManagedFatalVictims?: number;

  @ApiPropertyOptional({ description: 'Thương tích nặng ngoài quản lý', example: 0 })
  @IsOptional() @IsInt() @Min(0) nonManagedSevereInjuries?: number;

  @ApiPropertyOptional({ description: 'Chi phí y tế', example: 0.0 })
  @IsOptional() @IsNumber() @Min(0) medicalCost?: number;

  @ApiPropertyOptional({ description: 'Bồi thường lương', example: 0.0 })
  @IsOptional() @IsNumber() @Min(0) salaryCompensation?: number;

  @ApiPropertyOptional({ description: 'Thiệt hại tài sản', example: 0.0 })
  @IsOptional() @IsNumber() @Min(0) propertyDamage?: number;

  @ApiPropertyOptional({ description: 'Tổng chi phí', example: 0.0 })
  @IsOptional() @IsNumber() @Min(0) totalCost?: number;

  @ApiPropertyOptional({ description: 'Tổng số ngày nghỉ vì TNLĐ', example: 0 })
  @IsOptional() @IsInt() @Min(0) totalLeaveDays?: number;

  @ApiPropertyOptional({ description: 'Tổng thiệt hại', example: 0.0 })
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

  // =========================================================
  // MỤC 1: TÌNH HÌNH TAI NẠN LAO ĐỘNG (Tổng số liệu chung Tab 1)
  // =========================================================
  @ApiPropertyOptional({ example: 0 }) @IsOptional() @IsInt() @Min(0) m1TotalCases?: number;
  @ApiPropertyOptional({ example: 0 }) @IsOptional() @IsInt() @Min(0) m1FatalCases?: number;
  @ApiPropertyOptional({ example: 0 }) @IsOptional() @IsInt() @Min(0) m1MultiVictimCases?: number;
  @ApiPropertyOptional({ example: 0 }) @IsOptional() @IsInt() @Min(0) m1TotalVictims?: number;
  @ApiPropertyOptional({ example: 0 }) @IsOptional() @IsInt() @Min(0) m1FemaleVictims?: number;
  @ApiPropertyOptional({ example: 0 }) @IsOptional() @IsInt() @Min(0) m1FatalVictims?: number;
  @ApiPropertyOptional({ example: 0 }) @IsOptional() @IsInt() @Min(0) m1SevereInjuries?: number;

  @ApiPropertyOptional({ example: 0 }) @IsOptional() @IsInt() @Min(0) m1NonManagedVictims?: number;
  @ApiPropertyOptional({ example: 0 }) @IsOptional() @IsInt() @Min(0) m1NonManagedFemaleVictims?: number;
  @ApiPropertyOptional({ example: 0 }) @IsOptional() @IsInt() @Min(0) m1NonManagedFatalVictims?: number;
  @ApiPropertyOptional({ example: 0 }) @IsOptional() @IsInt() @Min(0) m1NonManagedSevereInjuries?: number;

  @ApiPropertyOptional({ example: 0 }) @IsOptional() @IsNumber() @Min(0) m1MedicalCost?: number;
  @ApiPropertyOptional({ example: 0 }) @IsOptional() @IsNumber() @Min(0) m1SalaryCompensation?: number;
  @ApiPropertyOptional({ example: 0 }) @IsOptional() @IsNumber() @Min(0) m1PropertyDamage?: number;
  @ApiPropertyOptional({ example: 0 }) @IsOptional() @IsNumber() @Min(0) m1TotalCost?: number;

  @ApiPropertyOptional({ example: 0 }) @IsOptional() @IsInt() @Min(0) m1TotalLeaveDays?: number;
  @ApiPropertyOptional({ example: 0 }) @IsOptional() @IsNumber() @Min(0) m1TotalDamage?: number;

  // =========================================================
  // MỤC 2: TNLĐ ĐƯỢC HƯỞNG TRỢ CẤP (Khoản 2 Điều 39)
  // =========================================================
  @ApiPropertyOptional({ example: 0 }) @IsOptional() @IsInt() @Min(0) m2TotalCases?: number;
  @ApiPropertyOptional({ example: 0 }) @IsOptional() @IsInt() @Min(0) m2FatalCases?: number;
  @ApiPropertyOptional({ example: 0 }) @IsOptional() @IsInt() @Min(0) m2MultiVictimCases?: number;
  @ApiPropertyOptional({ example: 0 }) @IsOptional() @IsInt() @Min(0) m2TotalVictims?: number;
  @ApiPropertyOptional({ example: 0 }) @IsOptional() @IsInt() @Min(0) m2FemaleVictims?: number;
  @ApiPropertyOptional({ example: 0 }) @IsOptional() @IsInt() @Min(0) m2FatalVictims?: number;
  @ApiPropertyOptional({ example: 0 }) @IsOptional() @IsInt() @Min(0) m2SevereInjuries?: number;

  @ApiPropertyOptional({ example: 0 }) @IsOptional() @IsInt() @Min(0) m2NonManagedVictims?: number;
  @ApiPropertyOptional({ example: 0 }) @IsOptional() @IsInt() @Min(0) m2NonManagedFemaleVictims?: number;
  @ApiPropertyOptional({ example: 0 }) @IsOptional() @IsInt() @Min(0) m2NonManagedFatalVictims?: number;
  @ApiPropertyOptional({ example: 0 }) @IsOptional() @IsInt() @Min(0) m2NonManagedSevereInjuries?: number;

  @ApiPropertyOptional({ example: 0 }) @IsOptional() @IsNumber() @Min(0) m2MedicalCost?: number;
  @ApiPropertyOptional({ example: 0 }) @IsOptional() @IsNumber() @Min(0) m2SalaryCompensation?: number;
  @ApiPropertyOptional({ example: 0 }) @IsOptional() @IsNumber() @Min(0) m2PropertyDamage?: number;
  @ApiPropertyOptional({ example: 0 }) @IsOptional() @IsNumber() @Min(0) m2TotalCost?: number;

  @ApiPropertyOptional({ example: 0 }) @IsOptional() @IsInt() @Min(0) m2TotalLeaveDays?: number;
  @ApiPropertyOptional({ example: 0 }) @IsOptional() @IsNumber() @Min(0) m2TotalDamage?: number;

  // =========================================================
  // QUAN HỆ & FILE ĐÍNH KÈM
  // =========================================================
  @ApiPropertyOptional({ type: [ReportDetailDto], description: 'Danh sách các vụ tai nạn lẻ' })
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => ReportDetailDto)
  details?: ReportDetailDto[];

  @ApiPropertyOptional({ example: ['uuid-1'], description: 'Mảng ID file đính kèm' })
  @IsOptional() @IsArray() @IsString({ each: true })
  fileIds?: string[];
}