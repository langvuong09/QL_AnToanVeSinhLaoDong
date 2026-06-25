import { PartialType } from '@nestjs/swagger';
import { CreateAccidentCauseDto } from './create-accident-cause.dto';

export class UpdateAccidentCauseDto extends PartialType(CreateAccidentCauseDto) {}