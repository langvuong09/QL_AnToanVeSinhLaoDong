import { EntityManager, DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import { ChangePasswordDto } from './dto/change-password';
export declare class UserService {
    private readonly dataSource;
    private readonly userRepository;
    manager: EntityManager;
    constructor(dataSource: DataSource, userRepository: Repository<User>);
    resetPassword(user_id: string, changePasswordDto: ChangePasswordDto): Promise<{
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
