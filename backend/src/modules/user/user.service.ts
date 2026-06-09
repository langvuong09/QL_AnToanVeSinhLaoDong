import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetAllDto } from '../../commons';
import Response from '../../commons/response';
import { EntityManager, DataSource, ILike, In, Not, Repository } from 'typeorm';
import { CurrentUser } from '../auth/auth.model';
import { User } from './user.entity';
import * as argon from 'argon2';

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

  async checkUsername(
    username: string,
  ): Promise<{ username: string; existed: boolean }> {
    try {
      const foundedUser = await this.userRepository.findOne({
        where: {
          username,
        },
      });
      const result = !!foundedUser;
      return {
        username,
        existed: result,
      };
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  async import(currentUser: CurrentUser, users: any): Promise<any> {
    try {
      let result: {
        success: number;
        err: number;
        username: string[];
      } = {
        success: 0,
        err: 0,
        username: [],
      };
      for (const user of users) {
        const existed = await this.checkUsername(user.username);
        if (existed.existed) {
          result.err += 1;
          result.username.push(user.username);
        } else {
          await this.userRepository.save(
            Object.assign(new User(), {
              ...user,
              password: user.password,
              createdBy: currentUser.id,
              createdAt: new Date(),
            }),
          );
          result.success += 1;
        }
      }
      return result;
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  async getAll(query: GetAllDto) {
    try {
      let { pageSize, pageNumber, order } = query;

      const select = (query.select && JSON.parse(query.select)) || null;

      let relations: any =
        (query.relation && JSON.parse(query.relation)) || null;
      if (Array.isArray(relations)) {
        relations = relations.reduce((acc, curr) => {
          acc[curr] = true;
          return acc;
        }, {});
      }

      const province = (query.province && JSON.parse(query.province)) || null;

      const where = (query.where && JSON.parse(query.where)) || {};
      if (where instanceof Array) {
        for (const item of where) {
          Object.keys(item).forEach((key) => {
            if (item[key].operation === 'like') {
              item[key] = ILike(item[key].value);
            } else if (item[key].operation === 'in') {
              item[key] = In(item[key].value);
            } else if (item[key].operation === 'notIn') {
              item[key] = Not(In(item[key].value));
            }
          });
        }
      } else {
        Object.keys(where).forEach((key) => {
          if (where[key].operation === 'like') {
            where[key] = ILike(where[key].value);
          } else if (where[key].operation === 'in') {
            where[key] = In(where[key].value);
          } else if (where[key].operation === 'notIn') {
            where[key] = Not(In(where[key].value));
          }
        });
      }
      let [items, count] = await this.userRepository.findAndCount({
        where,
        relations,
        select,
        order: { ...JSON.parse(order || '{}') },
        skip: pageNumber,
        take: pageSize,
        withDeleted: true,
      });
      if (!!province) {
        items = items.filter((x) => x.province?.key === province.key);
      }
      return Response.getList({
        items: items as any,
        count,
        pageSize: +pageSize!,
        pageNumber: +pageNumber!,
      });
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  async recovery(user_id) {
    await this.manager.query(`update users
                              set "deletedBy" = NULL,
                                  "deletedAt" = null
                              where id = '${user_id}'`);
    return {
      success: true,
    };
  }

  async resetPassword(user_id) {
    const _newPassword = await argon.hash('12345678');
    await this.manager.query(`update users
              set password = '${_newPassword}'
              where id = '${user_id}'`);
    return {
      success: true,
    };
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
