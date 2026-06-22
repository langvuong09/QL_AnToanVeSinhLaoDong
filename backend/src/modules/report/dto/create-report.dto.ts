import { IsNotEmpty, IsString, IsInt, IsArray, IsOptional, ValidateNested, IsNumber, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { AccidentCauseEnum } from '../../../commons/enums/accident.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ReportDetailDto {
  @ApiProperty({ 
    description: 'Nguyên nhân tai nạn', 
    enum: AccidentCauseEnum,
    enumName: 'AccidentCauseEnum' 
  })
  @IsOptional() 
  @IsEnum(AccidentCauseEnum) 
  cause?: AccidentCauseEnum;

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
}

export class CreateReportDto {
  @ApiProperty({ example: 'Báo cáo tai nạn lao động năm 2026', description: 'Tiêu đề báo cáo' })
  @IsNotEmpty() @IsString() title!: string;

  @ApiProperty({ example: 2026, description: 'Năm thực hiện báo cáo' })
  @IsNotEmpty() @IsInt() @Min(2000) year!: number;

  @ApiProperty({ example: 1, description: 'ID cấu hình loại báo cáo (Report Type)' })
  @IsNotEmpty() @IsInt() reportTypeId!: number;

  // === THÔNG TIN LAO ĐỘNG CƠ SỞ ===
  @ApiPropertyOptional({ example: 500, description: 'Tổng số lao động trong đơn vị' })
  @IsOptional() @IsInt() @Min(0) totalEmployees?: number;

  @ApiPropertyOptional({ example: 200, description: 'Số lao động nữ' })
  @IsOptional() @IsInt() @Min(0) femaleEmployees?: number;

  // === MỤC 1: TỔNG HỢP TAI NẠN ===
  @ApiPropertyOptional({ example: 5, description: 'M1: Tổng số vụ tai nạn' })
  @IsOptional() @IsInt() @Min(0) m1TotalCases?: number;

  @ApiPropertyOptional({ example: 1, description: 'M1: Số vụ tai nạn chết người' })
  @IsOptional() @IsInt() @Min(0) m1FatalCases?: number;

  @ApiPropertyOptional({ example: 0, description: 'M1: Số vụ tai nạn có nhiều người bị nạn' })
  @IsOptional() @IsInt() @Min(0) m1MultiVictimCases?: number;

  @ApiPropertyOptional({ example: 5, description: 'M1: Tổng số người bị nạn' })
  @IsOptional() @IsInt() @Min(0) m1TotalVictims?: number;

  @ApiPropertyOptional({ example: 2, description: 'M1: Số người bị nạn là nữ' })
  @IsOptional() @IsInt() @Min(0) m1FemaleVictims?: number;

  @ApiPropertyOptional({ example: 1, description: 'M1: Số người chết' })
  @IsOptional() @IsInt() @Min(0) m1FatalVictims?: number;

  @ApiPropertyOptional({ example: 2, description: 'M1: Số người bị thương nặng' })
  @IsOptional() @IsInt() @Min(0) m1SevereInjuries?: number;

  @ApiPropertyOptional({ example: 0, description: 'M1: Tổng số người bị nạn không thuộc diện quản lý' })
  @IsOptional() @IsInt() @Min(0) m1NonManagedVictims?: number;

  @ApiPropertyOptional({ example: 0, description: 'M1: Số người bị nạn là nữ không thuộc diện quản lý' })
  @IsOptional() @IsInt() @Min(0) m1NonManagedFemaleVictims?: number;

  @ApiPropertyOptional({ example: 0, description: 'M1: Số người chết không thuộc diện quản lý' })
  @IsOptional() @IsInt() @Min(0) m1NonManagedFatalVictims?: number;

  @ApiPropertyOptional({ example: 0, description: 'M1: Số người bị thương nặng không thuộc diện quản lý' })
  @IsOptional() @IsInt() @Min(0) m1NonManagedSevereInjuries?: number;

  @ApiPropertyOptional({ example: 15000000, description: 'M1: Chi phí y tế (VNĐ)' })
  @IsOptional() @IsNumber() @Min(0) m1MedicalCost?: number;

  @ApiPropertyOptional({ example: 30000000, description: 'M1: Chi phí bồi thường lương, trợ cấp (VNĐ)' })
  @IsOptional() @IsNumber() @Min(0) m1SalaryCompensation?: number;

  @ApiPropertyOptional({ example: 5000000, description: 'M1: Giá trị thiệt hại tài sản (VNĐ)' })
  @IsOptional() @IsNumber() @Min(0) m1PropertyDamage?: number;

  // === MỤC 2: TAI NẠN ĐƯỢC HƯỞNG TRỢ CẤP ===
  @ApiPropertyOptional({ example: 2, description: 'M2: Tổng số vụ tai nạn được hưởng trợ cấp' })
  @IsOptional() @IsInt() @Min(0) m2TotalCases?: number;

  @ApiPropertyOptional({ example: 0, description: 'M2: Số vụ chết người được hưởng trợ cấp' })
  @IsOptional() @IsInt() @Min(0) m2FatalCases?: number;

  @ApiPropertyOptional({ example: 0, description: 'M2: Số vụ nhiều người bị nạn được hưởng trợ cấp' })
  @IsOptional() @IsInt() @Min(0) m2MultiVictimCases?: number;

  @ApiPropertyOptional({ example: 2, description: 'M2: Tổng số người bị nạn được hưởng trợ cấp' })
  @IsOptional() @IsInt() @Min(0) m2TotalVictims?: number;

  @ApiPropertyOptional({ example: 1, description: 'M2: Số nạn nhân nữ được hưởng trợ cấp' })
  @IsOptional() @IsInt() @Min(0) m2FemaleVictims?: number;

  @ApiPropertyOptional({ example: 0, description: 'M2: Số người chết được hưởng trợ cấp' })
  @IsOptional() @IsInt() @Min(0) m2FatalVictims?: number;

  @ApiPropertyOptional({ example: 1, description: 'M2: Số ca thương tích nặng được hưởng trợ cấp' })
  @IsOptional() @IsInt() @Min(0) m2SevereInjuries?: number;

  @ApiPropertyOptional({ example: 0, description: 'M2: Số người ngoài diện quản lý (hưởng trợ cấp)' })
  @IsOptional() @IsInt() @Min(0) m2NonManagedVictims?: number;

  @ApiPropertyOptional({ example: 0, description: 'M2: Số người nữ ngoài diện quản lý (hưởng trợ cấp)' })
  @IsOptional() @IsInt() @Min(0) m2NonManagedFemaleVictims?: number;

  @ApiPropertyOptional({ example: 0, description: 'M2: Số người tử vong ngoài diện quản lý (hưởng trợ cấp)' })
  @IsOptional() @IsInt() @Min(0) m2NonManagedFatalVictims?: number;

  @ApiPropertyOptional({ example: 0, description: 'M2: Số người thương tích nặng ngoài diện quản lý (hưởng trợ cấp)' })
  @IsOptional() @IsInt() @Min(0) m2NonManagedSevereInjuries?: number;

  @ApiPropertyOptional({ example: 5000000, description: 'M2: Chi phí y tế hưởng trợ cấp (VNĐ)' })
  @IsOptional() @IsNumber() @Min(0) m2MedicalCost?: number;

  @ApiPropertyOptional({ example: 10000000, description: 'M2: Bồi thường lương hưởng trợ cấp (VNĐ)' })
  @IsOptional() @IsNumber() @Min(0) m2SalaryCompensation?: number;

  @ApiPropertyOptional({ example: 0, description: 'M2: Thiệt hại tài sản hưởng trợ cấp (VNĐ)' })
  @IsOptional() @IsNumber() @Min(0) m2PropertyDamage?: number;

  // === TAB 2: CHI TIẾT CÁC VỤ ===
  @ApiPropertyOptional({ type: [ReportDetailDto], description: 'Danh sách các vụ tai nạn lẻ' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReportDetailDto)
  details?: ReportDetailDto[];

  @ApiPropertyOptional({ example: ['uuid-1', 'uuid-2'], description: 'Mảng ID các file đính kèm' })
  @IsOptional() @IsArray() @IsString({ each: true })
  fileIds?: string[];
}