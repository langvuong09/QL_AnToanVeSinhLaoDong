import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import multerS3 from 'multer-s3'; 
import * as path from 'path';
import * as AWS from 'aws-sdk';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          limits: {
            fileSize: 1073741824, // 1GB
          },
          fileFilter: (req, file, cb) => {
            cb(null, true);
          },
          storage: multerS3({
            s3: new AWS.S3({
              accessKeyId: process.env.VNA_S3_ACCESS_ID,
              secretAccessKey: process.env.VNA_S3_ACCESS_KEY,
              params: {
                Bucket: process.env.VNA_S3_BUCKET,
              },
            }) as any, 
            bucket: process.env.VNA_S3_BUCKET || '',
            key: (req, file, cb) => {
              cb(
                null,
                `${
                  file.fieldname +
                  '-' +
                  Date.now() +
                  path.extname(file.originalname)
                }`,
              );
            },
          }),
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [MediaController],
  providers: [MediaService, ConfigService],
  exports: [MediaService],
})
export class MediaModule {}