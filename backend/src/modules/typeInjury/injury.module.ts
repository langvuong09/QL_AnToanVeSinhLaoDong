import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InjuryType } from './injury.entity';
import { InjuryTypeService } from './injury.service';
import { InjuryTypeController } from './injury.controller';
import { PermissionModule } from '../permission/permission.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([InjuryType]),
    PermissionModule
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
