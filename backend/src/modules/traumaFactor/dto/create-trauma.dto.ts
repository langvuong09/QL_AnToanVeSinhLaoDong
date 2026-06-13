import { IsNotEmpty, IsString, IsBoolean, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTraumaDto {
  @ApiProperty({ 
    example: 'Mã 1', 
    description: 'Mã của yếu tố gây chấn thương (Duy nhất, tự động trim khoảng trắng)' 
  })
  @IsString({ message: 'Mã yếu tố phải là một chuỗi ký tự!' })
  @IsNotEmpty({ message: 'Mã yếu tố không được để trống!' })
  @MaxLength(50, { message: 'Mã yếu tố không được vượt quá 50 ký tự!' })
  code!: string;

  @ApiProperty({ 
    example: 'Điện', 
    description: 'Tên hoặc mô tả chi tiết của yếu tố gây chấn thương' 
  })
  @IsString({ message: 'Tên yếu tố phải là một chuỗi ký tự!' })
  @IsNotEmpty({ message: 'Tên yếu tố gây chấn thương không được để trống!' })
  @MaxLength(255, { message: 'Tên yếu tố không được vượt quá 255 ký tự!' })
  name!: string;

  @ApiProperty({ 
    example: true, 
    required: false, 
    description: 'Trạng thái hoạt động của danh mục (Mặc định là true)' 
  })
  @IsBoolean({ message: 'Trạng thái hoạt động phải là kiểu giá trị Boolean (true/false)!' })
  @IsOptional()
  isActive?: boolean;
}