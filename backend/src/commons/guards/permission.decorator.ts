import { SetMetadata } from '@nestjs/common';
import { PermissionCode } from '../enums/permission.enum';
export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (...codes: PermissionCode[]) => 
  SetMetadata(PERMISSIONS_KEY, codes);