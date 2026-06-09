import { User } from "../user/user.entity";
export declare class Role {
    constructor(role?: Partial<Role>, keys?: string[]);
    id: number;
    role: string;
    name: string;
    type: string;
    status: boolean;
    users: Array<User>;
}
