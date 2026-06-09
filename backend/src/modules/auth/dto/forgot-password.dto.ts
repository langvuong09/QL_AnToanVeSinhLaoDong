import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class ForgotPasswordDto {
  @ApiProperty({ 
    example: 'admin@example.com', 
    description: 'Địa chỉ Email để nhận liên kết đặt lại mật khẩu' 
  })
  @IsEmail({}, { message: 'Định dạng email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email!: string;
}