import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsDateString, IsOptional, IsNumber, IsBoolean, IsUUID, IsObject } from 'class-validator';
import { KeyValue } from 'src/commons/bases/baseAddressEntity';

export class UpdateProfileDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() fullName?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsDateString() dateOfBirth?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() gender?: string;

  @ApiProperty({ example: { key: '79', value: 'Thành phố Hồ Chí Minh' }, required: false }) 
  @IsOptional() 
  @IsObject() 
  province?: KeyValue; 

  @ApiProperty({ example: 'nguyenvana@gmail.com' })
  @IsOptional({ message: 'Email là bắt buộc' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email!: string;
  

  @ApiProperty({ example: { key: '760', value: 'Quận 1' }, required: false }) 
  @IsOptional() 
  @IsObject() 
  district?: KeyValue;

  @ApiProperty({ example: { key: '26734', value: 'Phường Bến Nghé' }, required: false }) 
  @IsOptional() 
  @IsObject() 
  ward?: KeyValue;

  @ApiProperty({ required: false }) @IsOptional() @IsString() address?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsNumber() roleId?: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() position?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() status?: boolean;
  
  @ApiProperty({ required: false, example: 'b3cbd6ca-df77-47b4-90a6-1681283c847e', description: 'ID của file avatar (UUID)' })
  @IsOptional()
  @IsUUID('4', { message: 'Avatar ID phải là định dạng UUID hợp lệ' })
  avatarId?: string;
}