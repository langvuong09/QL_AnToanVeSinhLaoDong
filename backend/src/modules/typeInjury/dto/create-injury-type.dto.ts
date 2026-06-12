import { IsNotEmpty, IsString, IsBoolean, IsOptional, IsInt, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInjuryTypeDto {
  @ApiProperty({ example: '011', description: 'Mã số loại chấn thương' })
  @IsString({ message: 'Mã số phải là chuỗi ký tự!' })
  @IsNotEmpty({ message: 'Mã số không được để trống!' })
  @MaxLength(50, { message: 'Mã số không được vượt quá 50 ký tự!' })
  code!: string;

  @ApiProperty({ example: 'Các chấn thương sọ não hở hoặc kín', description: 'Tên loại chấn thương' })
  @IsString({ message: 'Tên loại chấn thương phải là chuỗi ký tự!' })
  @IsNotEmpty({ message: 'Tên loại chấn thương không được để trống!' })
  @MaxLength(255, { message: 'Tên loại chấn thương không được vượt quá 255 ký tự!' })
  name!: string;

  @ApiProperty({ example: 1, required: false, description: 'ID của danh mục cha (nếu có)' })
  @IsInt({ message: 'ID cha phải là số nguyên!' })
  @IsOptional()
  parentId?: number;

  @ApiProperty({ example: true, required: false, description: 'Trạng thái hoạt động' })
  @IsBoolean({ message: 'Trạng thái phải là kiểu Boolean!' })
  @IsOptional()
  isActive?: boolean;
}