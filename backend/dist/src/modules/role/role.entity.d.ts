import { User } from "../user/user.entity";
import { Permission } from "../permission/permission.entity";
export declare class Role {
    id: number;
    name: string;
    code: string;
    users: User[];
    permissions: Permission[];
}
