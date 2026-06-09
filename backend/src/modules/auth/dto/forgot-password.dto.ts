import { ApiProperty } from "@nestjs/swagger";

export class ForgotPasswordDto {
  @ApiProperty({ example: 'admin@example.com', description: 'Địa chỉ Email để nhận liên kết đặt lại mật khẩu' })
  email!: string;
}
