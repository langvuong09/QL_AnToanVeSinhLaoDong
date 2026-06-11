import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetAllDto } from '../../commons';
import Response from '../../commons/response';
import { EntityManager, DataSource, ILike, In, Not, Repository } from 'typeorm';
import { CurrentUser } from '../auth/auth.model';
import { User } from './user.entity';
import * as argon from 'argon2';
import { ChangePasswordDto } from './dto/change-password';

@Injectable()
export class UserService {
  manager: EntityManager;

  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    this.manager = this.dataSource.createEntityManager();
  }

  async resetPassword(user_id: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.manager.findOne(User, {
      where: { id: user_id },
      select: {
        id: true,
        password: true,
      },
    });

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
    await this.manager.update(User, user_id, {
      password: hashedPassword,
    });
    return { success: true };
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
}
