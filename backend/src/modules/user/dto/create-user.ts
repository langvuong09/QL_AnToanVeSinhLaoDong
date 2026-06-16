import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsNotEmpty, IsEmail, IsDateString, IsOptional, IsNumber, Matches, MinLength, IsUUID, IsObject, IsBoolean } from 'class-validator';
import { KeyValue } from 'src/commons/bases/baseAddressEntity';

export class CreateUserDto {
  @ApiProperty({ example: 'admin_doet' })
  @IsNotEmpty({ message: 'Tên đăng nhập (username) là bắt buộc' })
  @IsString()
  username!: string;

  @ApiProperty({ example: 'Doet@123456' })
  @IsNotEmpty({ message: 'Mật khẩu là bắt buộc' })
  @MinLength(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
  @Matches(
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, 
    { message: 'Mật khẩu phải bao gồm: chữ hoa, chữ thường, số hoặc ký tự đặc biệt' }
  )
  password!: string;

  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsNotEmpty({ message: 'Họ và tên là bắt buộc' })
  @IsString()
  fullName!: string;

  @ApiProperty({ example: 'nguyenvana@gmail.com' })
  @IsNotEmpty({ message: 'Email là bắt buộc' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email!: string;

  @ApiProperty({ example: '2000-01-01' })
  @IsNotEmpty({ message: 'Ngày sinh là bắt buộc' })
  @IsDateString({}, { message: 'Ngày sinh không hợp lệ' })
  dateOfBirth!: string;

  @ApiProperty({ example: 'Nam' })
  @IsNotEmpty({ message: 'Giới tính là bắt buộc' })
  @IsString()
  gender!: string;

  @ApiProperty({ example: 2 })
  @IsNotEmpty({ message: 'Vai trò (roleId) là bắt buộc' })
  @IsNumber({}, { message: 'Vai trò phải là một con số' })
  roleId!: number;

  @ApiProperty({ example: 'Chuyên viên kiểm định' })
  @IsNotEmpty({ message: 'Chức vụ là bắt buộc' })
  @IsString()
  position!: string;

  @ApiProperty({ example: { key: '79', value: 'Thành phố Hồ Chí Minh' } })
  @IsNotEmpty({ message: 'Tỉnh/Thành phố là bắt buộc' })
  @IsObject({ message: 'Tỉnh/Thành phố phải là một đối tượng KeyValue' })
  province!: KeyValue;

  @ApiProperty({ example: { key: '760', value: 'Quận 1' } })
  @IsNotEmpty({ message: 'Quận/Huyện là bắt buộc' })
  @IsObject({ message: 'Quận/Huyện phải là một đối tượng KeyValue' })
  district!: KeyValue; 
  @ApiProperty({ example: { key: '26734', value: 'Phường Bến Nghé' } })
  @IsNotEmpty({ message: 'Phường/Xã là bắt buộc' })
  @IsObject({ message: 'Phường/Xã phải là một đối tượng KeyValue' })
  ward!: KeyValue;

  @ApiProperty({ example: '162 đường số 2' })
  @IsNotEmpty({ message: 'Địa chỉ là bắt buộc' })
  @IsString()
  address!: string;

  @ApiProperty({ required: false, example: 'b3cbd6ca-df77-47b4-90a6-1681283c847e', description: 'ID của file avatar (UUID)' })
  @IsOptional()
  @IsUUID('4', { message: 'Avatar ID phải là định dạng UUID hợp lệ' })
  avatarId?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  status?: boolean;
}