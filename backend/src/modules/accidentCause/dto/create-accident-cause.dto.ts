import { IsNotEmpty, IsString, IsBoolean, IsOptional, MaxLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AccidentCauseType } from 'src/commons/enums/cause-type.enum';

export class CreateAccidentCauseDto {
  @ApiProperty({ example: 'MECH_01', description: 'Mã nguyên nhân' })
  @IsString() @IsNotEmpty() @MaxLength(50)
  code!: string;

  @ApiProperty({ example: 'Kẹt máy', description: 'Tên nguyên nhân tai nạn' })
  @IsString() @IsNotEmpty() @MaxLength(255)
  name!: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean() @IsOptional()
  isActive?: boolean;

  @ApiProperty({ enum: AccidentCauseType })
  @IsEnum(AccidentCauseType)
  type!: AccidentCauseType;
}