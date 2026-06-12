import { PartialType } from '@nestjs/swagger';
import { CreateInjuryTypeDto } from './create-injury-type.dto';

export class UpdateInjuryTypeDto extends PartialType(CreateInjuryTypeDto) {}