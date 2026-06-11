import { EntityManager, DataSource, Repository } from 'typeorm';
import { View } from './view.entity';
import { BaseService } from "../../commons/bases/baseService";
import { PermissionService } from '../permission/permission.service';
export declare class ViewService extends BaseService<View> {
    private readonly viewRepository;
    private readonly dataSource;
    private readonly permissionService;
    manager: EntityManager;
    constructor(viewRepository: Repository<View>, dataSource: DataSource, permissionService: PermissionService);
    getViewsByRoleCode(roleCode: string): Promise<import("src/commons/response").ResponseData<{
        items: any[];
    }>>;
}
