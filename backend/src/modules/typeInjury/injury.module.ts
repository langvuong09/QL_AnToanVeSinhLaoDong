import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InjuryType } from './injury.entity';
import { InjuryTypeService } from './injury.service';
import { InjuryTypeController } from './injury.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([InjuryType])
  ],
  controllers: [
    InjuryTypeController
  ],
  providers: [
    InjuryTypeService
  ],
  exports: [
    InjuryTypeService
  ]
})
export class InjuryTypeModule {}