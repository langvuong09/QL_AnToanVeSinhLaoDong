import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as AWS from "aws-sdk";
// import { AppConfig } from 'src/commons/config/config';
import Response, { ResponseData } from "src/commons/response";
import { UploadResponse } from "./media.model";

@Injectable()
export class MediaService {
  s3Client: AWS.S3;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new AWS.S3({
      accessKeyId: process.env.VNA_S3_ACCESS_ID,
      secretAccessKey: process.env.VNA_S3_ACCESS_KEY,
      params: {
        Bucket: process.env.VNA_S3_BUCKET
      }
    });
  }

  async uploadFile(file: any): Promise<ResponseData<UploadResponse>> {
    try {
      const publicUrl = await this.generateUrl(file.key);
      const item = new UploadResponse({
        url: file.location,
        secure_url: `https://static-dev.dggv.edu.vn/${file.key}`,
        public_id: file.key,
        format: file.mimetype.split("/")[1],
        public_url: publicUrl.url
      });
      return Response.get<UploadResponse>(item);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  async generateUrl(key: string): Promise<any> {
    try {
      const url = await new Promise((resolve, reject) => {
        this.s3Client.getSignedUrl(
          "getObject",
          { Bucket: process.env.VNA_S3_BUCKET, Key: key, Expires: 43200000 },
          (err, url) => {
            if (err)
              return reject(err);
            return resolve(url);
          }
        );
      });
      return { url };
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }
}
