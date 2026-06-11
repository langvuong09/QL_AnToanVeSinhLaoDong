import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from 'src/redis/redis.module';
import { PERMISSIONS_KEY } from './permission.decorator';
import { DataSource } from 'typeorm'; // Thêm vào
import { Role } from 'src/modules/role/role.entity';
import { PermissionService } from 'src/modules/permission/permission.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly permissionService: PermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredCodes = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredCodes || requiredCodes.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const roleCode = req.user?.role?.code; 

    if (!roleCode) throw new ForbiddenException('Bạn không có Role');

    const permissions = await this.permissionService.getPermissionsByRoleCode(roleCode);
    
    const userPermissionCodes = permissions.map((p) => p.code);

    const hasPermission = requiredCodes.some((code) =>
      userPermissionCodes.includes(code),
    );

    if (!hasPermission) throw new ForbiddenException('Bạn không có quyền thực hiện hành động này');
    return true;
  }
}
