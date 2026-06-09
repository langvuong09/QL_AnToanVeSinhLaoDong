import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength, Matches, ValidateIf } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: 'eyJhbGci...', description: 'Reset Token nhận được từ email' })
  @IsNotEmpty({ message: 'Token không được để trống' })
  token!: string;

  @ApiProperty({ example: 'NewPassword123!', description: 'Mật khẩu mới' })
  @IsNotEmpty({ message: 'Mật khẩu mới không được để trống' })
  @MinLength(8, { message: 'Mật khẩu phải có tối thiểu 8 ký tự' })
  newPassword!: string;

  @ApiProperty({ example: 'NewPassword123!', description: 'Xác nhận mật khẩu mới' })
  @IsNotEmpty({ message: 'Vui lòng xác nhận mật khẩu' })
  @MinLength(8, { message: 'Mật khẩu xác nhận phải có tối thiểu 8 ký tự' })
  confirmPassword!: string;
}