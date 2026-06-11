import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import multerS3 from 'multer-s3'; 
import * as path from 'path';
import * as AWS from 'aws-sdk';
import { AuthGuard } from 'src/commons/guards/authGuard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
  ],
  controllers: [MediaController],
  providers: [MediaService, AuthGuard],
  exports: [MediaService],
})
export class MediaModule {}