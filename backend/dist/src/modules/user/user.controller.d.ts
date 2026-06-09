import { UserService } from "./user.service";
import { GetAllDto } from "../../commons";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    checkUsername(username: string): Promise<{
        username: string;
        existed: boolean;
    }>;
    getAll(query: GetAllDto): Promise<any>;
    import(req: any, users: any): Promise<{
        success: number;
        err: number;
        username: [];
    }>;
    recovery(user_id: string): Promise<{
        success: boolean;
    }>;
    resetPassword(id: string): Promise<{
        success: boolean;
    }>;
}
