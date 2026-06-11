import { Inject, Injectable } from "@nestjs/common";
import Redis from "ioredis/built/Redis";
import { Role } from "../role/role.entity";
import { REDIS_CLIENT } from "src/redis/redis.module";
import { DataSource } from "typeorm";


@Injectable()
export class PermissionService {
  constructor(
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    private readonly dataSource: DataSource,
  ) {}

  async getPermissionsByRoleCode(roleCode: string): Promise<any[]> {
    const redisKey = `perms:${roleCode}`;
    
    const cached = await this.redis.get(redisKey);
    if (cached) return JSON.parse(cached);

    const roleRepo = this.dataSource.getRepository(Role);
    const role = await roleRepo.findOne({
      where: { code: roleCode },
      relations: { permissions: true } as any,
    });

    if (!role) return [];

    await this.redis.set(redisKey, JSON.stringify(role.permissions), 'EX', 3600);
    
    return role.permissions;
  }
}