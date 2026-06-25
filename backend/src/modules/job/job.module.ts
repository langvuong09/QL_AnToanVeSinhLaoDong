import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './job.entity';
import {  JobService } from './job.service';
import { JobController } from './job.controller';
import { PermissionModule } from 'src/modules/permission/permission.module';

@Module({
  imports: [TypeOrmModule.forFeature([Job]), PermissionModule],
  controllers: [JobController],
  providers: [JobService],
  exports: [JobService],
})
export class JobModule {}