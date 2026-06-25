import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateJobDto {
  @ApiProperty({ example: '01', description: 'Mã ngành nghề' })
  @IsNotEmpty({ message: 'Mã ngành nghề không được để trống' })
  @IsString()
  code!: string;

  @ApiProperty({ example: 'Nông nghiệp và hoạt động dịch vụ có liên quan', description: 'Tên ngành nghề' })
  @IsNotEmpty({ message: 'Tên ngành nghề không được để trống' })
  @IsString()
  name!: string;

  @ApiProperty({ example: true, required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: 1, required: false, description: 'ID của ngành cha (nếu có)' })
  @IsOptional()
  @IsNumber({}, { message: 'ID ngành cha phải là số nguyên' })
  parentId?: number;
}