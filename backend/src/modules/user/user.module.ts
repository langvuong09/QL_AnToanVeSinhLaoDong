import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PermissionModule } from '../permission/permission.module';
import { JwtModule } from '@nestjs/jwt';
import { RedisModule } from 'src/redis/redis.module';
import { EmailModule } from 'src/helper/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]) , PermissionModule, RedisModule, EmailModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService , JwtModule],
})
export class UserModule {}