import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ example: 'superadmin', description: 'Tên đăng nhập' })
  username!: string;

  @ApiProperty({ example: '12345678', description: 'Mật khẩu' })
  password!: string;
}
