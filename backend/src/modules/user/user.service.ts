import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';
import { InjectRepository } from '@nestjs/typeorm';
import Response from '../../commons/response';
import { EntityManager, DataSource, Not, Repository, In } from 'typeorm';
import { User } from './user.entity';
import * as argon from 'argon2';
import { ChangePasswordDto } from './dto/change-password';
import { UpdateProfileDto } from './dto/update-profile';
import { getOtpKey, OtpType } from 'src/commons/enums/otp.enum';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import path from 'path';
import { ConfigService } from '@nestjs/config';
import { REDIS_CLIENT } from 'src/redis/redis.module';
import { EmailService } from 'src/helper/Email';

@Injectable()
export class UserService {
  manager: EntityManager;

  constructor(
    private readonly dataSource: DataSource,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    private readonly emailService: EmailService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    this.manager = this.dataSource.createEntityManager();
  }

  async resetPassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.userRepository.createQueryBuilder('user')
      .where('user.id = :userId', { userId })
      .andWhere('user.deletedAt IS NULL')
      .select(['user.id', 'user.password'])
      .getOne();

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    const isMatch = await argon.verify(
      user.password,
      changePasswordDto.oldPassword,
    );

    if (!isMatch) {
      throw new BadRequestException('Mật khẩu cũ không chính xác');
    }

    const hashedPassword = await argon.hash(changePasswordDto.newPassword);
    await this.userRepository.update(userId, {
      password: hashedPassword,
    });
    return Response.SUCCESSFULLY;
  }

  async updateProfile(userId: string, updateDto: UpdateProfileDto) {
    const user = await this.userRepository.findOne({
      where: { id: userId }
    });
    if (!user || user.deletedAt) throw new NotFoundException('Không tìm thấy người dùng');
    
    Object.assign(user, updateDto);
    return await this.userRepository.save(user);
  }

  async createUser(createUserDto: any) {
    const newUser = this.userRepository.create(createUserDto);
    return await this.userRepository.save(newUser);
  }

  async toggleStatus(userId: string, status: boolean) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user || user.deletedAt) throw new NotFoundException('Không tìm thấy người dùng');
    
    user.status = status;
    await this.userRepository.save(user);
    return Response.SUCCESSFULLY;
  }

  async setPassword(userId: string, newPassword: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user || user.deletedAt) throw new NotFoundException('Không tìm thấy người dùng');
    
    const hashedPassword = await argon.hash(newPassword);
    user.password = hashedPassword;
    await this.userRepository.save(user);
    return Response.SUCCESSFULLY;
  }

  async getAll(query: { 
    page?: number; 
    pageSize?: number; 
    fullName?: string;    
    username?: string;    
    email?: string;       
    roleId?: number;      
    position?: string;    
    status?: any;       
  }) {
    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 10;
    const { fullName, username, email, roleId, position, status } = query;

    const queryBuilder = this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.doet', 'doet')
      .where('user.deletedAt IS NULL')
      .andWhere('user.doetId IS NULL');

    if (fullName) {
      queryBuilder.andWhere('user.fullName ILike :fullName', { fullName: `%${fullName.trim()}%` });
    }

    if (username) {
      queryBuilder.andWhere('user.username ILike :username', { username: `%${username.trim()}%` });
    }

    if (email) {
      queryBuilder.andWhere('user.email ILike :email', { email: `%${email.trim()}%` });
    }

    if (roleId) {
      queryBuilder.andWhere('user.roleId = :roleId', { roleId });
    }

    if (position) {
      queryBuilder.andWhere('user.position ILike :position', { position: `%${position.trim()}%` });
    }

    if (status !== undefined && status !== null && status !== '') {
      const statusBool = status === 'true' || status === true;
      queryBuilder.andWhere('user.status = :statusBool', { statusBool });
    }

    const [items, count] = await queryBuilder
      .orderBy('user.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return Response.getList({
      items,
      count,
      pageSize,
      pageNumber: page
    });
  }

  async getDetail(id: string) {
    const user = await this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.doet', 'doet')
      .leftJoinAndSelect('user.avatar', 'avatar')
      .where('user.id = :id', { id })
      .andWhere('user.deletedAt IS NULL')
      .getOne();

    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng hoặc tài khoản đã bị xóa');
    }
    return Response.get(user);
  }

  async get(query: { where: string; relation?: string }) {
    try {
      const where = (query.where && JSON.parse(query.where)) || {};
      let relations: any =
        (query.relation && JSON.parse(query.relation)) || null;

      if (Array.isArray(relations)) {
        relations = relations.reduce((acc, curr) => {
          acc[curr] = true;
          return acc;
        }, {});
      }

      const [items, count] = await this.userRepository.findAndCount({
        where,
        relations,
        take: 1,
      });

      return {
        data: {
          items,
          count,
        },
      };
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  async bulkRemove(ids: string[]) {
    if (!ids || ids.length === 0) {
      throw new BadRequestException('Danh sách ID người dùng cần xóa không được để trống');
    }

    const users = await this.userRepository.findBy({ id: In(ids) });
    if (users.length === 0) {
      throw new NotFoundException('Không tìm thấy tài khoản người dùng nào hợp lệ để xóa');
    }

    await this.userRepository.softDelete(ids);
    return Response.SUCCESSFULLY;
  }

   async sendResetEmail(email: string) {
      const manage = this.dataSource.manager;
      const user = await manage.findOne(User, {
        where: {
          email: email,
        },
      });
      if (!user) {
        throw new NotFoundException('Not found email');
      }
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const redisKey = getOtpKey(OtpType.RESET_EMAIL, user.id);
      const ttl = this.configService.get<number>('OTP_EXPIRATION_TIME') || 300;
      await this.redis.set(redisKey, otp, 'EX', ttl);
  
      const templatePath = path.join(
        process.cwd(),
        'src',
        'templates',
        'reset-email.html',
      );
      let template = fs.readFileSync(templatePath, { encoding: 'utf-8' });
  
      template = template.split('$1').join(user.fullName);
      template = template.split('$2').join(otp);
      template = template.split('$3').join((ttl / 60).toString());
  
      await this.emailService.sendMail(
        email,
        'Mã xác thực thiết lập lại email',
        template,
      );
      return Response.SUCCESSFULLY;
    }
}