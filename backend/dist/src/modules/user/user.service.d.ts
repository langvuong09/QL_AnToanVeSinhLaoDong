import { GetAllDto } from '../../commons';
import { EntityManager, DataSource, Repository } from 'typeorm';
import { CurrentUser } from '../auth/auth.model';
import { User } from './user.entity';
export declare class UserService {
    private readonly dataSource;
    private readonly userRepository;
    manager: EntityManager;
    constructor(dataSource: DataSource, userRepository: Repository<User>);
    checkUsername(username: string): Promise<{
        username: string;
        existed: boolean;
    }>;
    import(currentUser: CurrentUser, users: any): Promise<any>;
    getAll(query: GetAllDto): Promise<import("../../commons").ResponseData<import("../../commons").List<unknown[]>>>;
    recovery(user_id: any): Promise<{
        success: boolean;
    }>;
    resetPassword(user_id: any): Promise<{
        success: boolean;
    }>;
    get(query: {
        where: string;
        relation?: string;
    }): Promise<{
        data: {
            items: User[];
            count: number;
        };
    }>;
}
