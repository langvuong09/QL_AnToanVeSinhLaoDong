import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsDateString, IsObject, Matches } from 'class-validator';
import { KeyValue } from 'src/commons/bases/baseAddressEntity';

export class CreateDoetDto {
  @ApiProperty({ example: 'Công ty Cổ phần Công nghệ Quốc tế VNA' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @ApiProperty({ 
    example: '9100008882', 
    description: 'Mã số thuế doanh nghiệp (10 số) hoặc chi nhánh (13 số)' 
  })
  @IsNotEmpty({ message: 'Mã số thuế không được để trống' })
  @IsString({ message: 'Mã số thuế phải là chuỗi ký tự' })
  @Matches(
    /^(?:\d{10}|\d{10}-\d{3}|\d{13})$/, 
    { message: 'Mã số thuế không đúng định dạng quy định (phải gồm 10 số hoặc 13 số)' }
  )
  taxCode!: string;

  @ApiProperty({ example: '2020-01-01' })
  @IsNotEmpty()
  @IsDateString()
  issuedDate!: Date;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  businessTypeId!: number;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsNumber()
  industryId!: number;

  @ApiProperty({ example: 'VNA Group', required: false })
  @IsOptional()
  @IsString()
  foreignName?: string;

  @ApiProperty({ example: 'Nguyễn Văn A', required: false })
  @IsOptional()
  @IsString()
  representative?: string;

  @ApiProperty({ example: '0987654321', required: false })
  @IsOptional()
  @IsString()
  repPhone?: string;

  @ApiProperty({ example: '0987654321', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'nguyenvana@example.com', required: false })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ example: '162 đường số 2', required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'Khu phố 2', required: false })
  @IsOptional()
  @IsString()
  quarter?: string;

  @ApiProperty({ example: { key: '79', value: 'Thành phố Hồ Chí Minh' } })
  @IsNotEmpty()
  @IsObject()
  province!: KeyValue;

  @ApiProperty({ example: { key: '760', value: 'Quận 1' } })
  @IsNotEmpty()
  @IsObject()
  district!: KeyValue;

  @ApiProperty({ example: { key: '26734', value: 'Phường Bến Nghé' } })
  @IsNotEmpty()
  @IsObject()
  ward!: KeyValue;

  @ApiProperty({ 
    description: 'Mã token chứng thực sau khi xác thực OTP thành công (Chỉ bắt buộc truyền ở luồng public-register)', 
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    required: false 
  })
  @IsOptional()
  @IsString()
  registerToken?: string;
}