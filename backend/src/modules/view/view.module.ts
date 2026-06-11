import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViewController } from '../view/view.controller';
import { View } from './view.entity';
import { ViewService } from './view.service';
import { PermissionModule } from '../permission/permission.module';

@Module({
  imports: [TypeOrmModule.forFeature([View]),PermissionModule],
  providers: [ViewService],
  controllers: [ViewController],
  exports: [ViewService],
})
export class ViewModule {}