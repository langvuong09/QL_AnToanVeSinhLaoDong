import { PartialType } from '@nestjs/swagger';
import { CreateTraumaDto } from './create-trauma.dto';

export class UpdateTraumaDto extends PartialType(CreateTraumaDto) {}