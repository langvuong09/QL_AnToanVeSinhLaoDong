import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Response from 'src/commons/response';
import { EntityManager, DataSource, Repository } from 'typeorm';
import { View } from './view.entity';
import { BaseService } from 'src/commons/bases/baseService';
import { PermissionService } from '../permission/permission.service';

@Injectable()
export class ViewService extends BaseService<View> {
  manager: EntityManager;
  constructor(
    @InjectRepository(View)
    private readonly viewRepository: Repository<View>,
    private readonly dataSource: DataSource,
    private readonly permissionService: PermissionService,
  ) {
    super(viewRepository, View);
    this.manager = this.dataSource.manager;
  }

  async getViewsByRoleCode(roleCode: string) {
    // 1. Lấy toàn bộ View và load bảng trung gian requiredPermissions
    const allViews = await this.viewRepository.find({
      relations: { requiredPermissions: true },
      order: { order: 'ASC' },
    });

    // 2. Lấy danh sách ID quyền mà role này sở hữu
    const rolePermissions = await this.permissionService.getPermissionsByRoleCode(roleCode);
    const rolePermissionIds = rolePermissions.map((p) => p.id);

    // 3. Hàm kiểm tra quyền chặt chẽ (Default Deny)
    const hasPermission = (view: View) => {
  // 1. Nếu không có cấu hình quyền nào -> mặc định không cho hiện (False)
  if (!view.requiredPermissions || view.requiredPermissions.length === 0) {
    return false; 
  }
  
  // 2. Kiểm tra xem role của bạn có chứa ID nào trong danh sách quyền yêu cầu không
  const hasAccess = view.requiredPermissions.some((p) => rolePermissionIds.includes(p.id));
  
  // DEBUG: In ra để xem Role 4 thực sự có ID 1 không
  console.log(`View: ${view.name} (ID: ${view.id})`);
  console.log(`Role Permission IDs:`, rolePermissionIds);
  console.log(`View Required IDs:`, view.requiredPermissions.map(p => p.id));
  console.log(`Has Access: ${hasAccess}`);
  
  return hasAccess;
};

    // 4. Đệ quy cắt tỉa cây
    const pruneTree = (parentId: number | null): any[] => {
      return allViews
        .filter((view) => view.parentId === parentId)
        .map((view) => {
          // --- XỬ LÝ CẤP CHA (Root) ---
          if (view.parentId === null) {
            return { ...view, children: pruneTree(view.id) };
          }

          // --- XỬ LÝ CẤP CON/CHÁU ---
          // Nếu có quyền: Giữ lại và đệ quy tìm các nhánh con bên dưới
          if (hasPermission(view)) {
            return { ...view, children: pruneTree(view.id) };
          }

          // Nếu không có quyền: Loại bỏ hoàn toàn nhánh này
          return null;
        })
        .filter((view) => view !== null); // Loại bỏ các node đã bị set null
    };

    const tree = pruneTree(null);
    return Response.get({ items: tree });
  }
}