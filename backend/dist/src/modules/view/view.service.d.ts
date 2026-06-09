import { ResponseData, List } from "../../commons/response";
import { EntityManager, DataSource, Repository } from 'typeorm';
import { View } from './view.entity';
import { BaseService } from "../../commons/bases/baseService";
export declare class ViewService extends BaseService<View> {
    private readonly viewRepository;
    private readonly dataSource;
    manager: EntityManager;
    constructor(viewRepository: Repository<View>, dataSource: DataSource);
    getViewsByRoleId(roleId: number): Promise<ResponseData<List<View[]>>>;
}
