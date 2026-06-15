import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from "@nestjs/common";
import Response from 'src/commons/response'; 
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { FileType } from "./media.model";
import { ConfigService } from "@nestjs/config";
import { FileEntity } from "./media.entity";

@Injectable()
export class MediaService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadFile(file: Express.Multer.File, fileType: FileType, doetId?: number) {
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException('File quá lớn! Vui lòng chọn file nhỏ hơn 10MB.');
    }

    const documentMimetypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    const isDocument = documentMimetypes.includes(file.mimetype);

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: 'vna_files', 
          resource_type: isDocument ? 'raw' : 'auto', 
        },
        async (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new InternalServerErrorException("Cloudinary lỗi"));

          const parsedDoetId = (doetId && Number(doetId) > 0) ? Number(doetId) : null;
          
          const newFile = this.fileRepository.create({
            originalFilename: file.originalname,
            url: result.secure_url,
            secureUrl: result.secure_url,
            publicId: result.public_id,
            format: result.format, // pdf, png, docx...
            type: result.resource_type, // Lưu giá trị 'raw' hoặc 'image' từ Cloudinary
            width: result.width,
            height: result.height,
            fileType: fileType,
            doetId: parsedDoetId ?? undefined, 
          });

          try {
            const savedFile = await this.fileRepository.save(newFile);
            resolve(savedFile);
          } catch (dbError) {
            reject(new InternalServerErrorException("Lỗi lưu database"));
          }
        }
      );
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  getFileUrl(publicId: string, options?: any) {
    return cloudinary.url(publicId, options);
  }

  async getDownloadUrl(id: string) {
    const file = await this.fileRepository.findOneBy({ id });
    if (!file) throw new NotFoundException("File không tồn tại");
    
    const resourceType = file.type || 'image';
    return cloudinary.url(file.publicId, { flags: 'attachment', resource_type: resourceType });
  }

  async deleteFile(id: string) {
    const file = await this.fileRepository.findOneBy({ id });
    if (!file) throw new NotFoundException("File không tồn tại");

    try {
      const resourceType = file.type || 'image';

      const cloudinaryResult = await cloudinary.uploader.destroy(file.publicId, {
        resource_type: resourceType,
        invalidate: true 
      });

      if (cloudinaryResult.result !== 'ok' && cloudinaryResult.result !== 'not_found') {
        throw new InternalServerErrorException(`Không thể xóa file vật lý trên Cloudinary: ${cloudinaryResult.result}`);
      }

      await this.fileRepository.delete(id);
      
      return Response.get({ message: "Xóa file thành công" });
    } catch (error: any) {
      if (error instanceof NotFoundException || error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException(`Lỗi hệ thống khi xóa file: ${error.message}`);
    }
  }

  async uploadMultipleFiles(files: Express.Multer.File[], fileType: FileType, doetId?: number) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Danh sách file tải lên không được để trống.');
    }

    const uploadPromises = files.map(file => this.uploadFile(file, fileType, doetId));
    
    return await Promise.all(uploadPromises);
  }
}