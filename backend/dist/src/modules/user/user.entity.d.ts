import { Role } from "../role/role.entity";
export declare class User {
    id: string;
    username: string;
    password: string;
    fullName: string;
    realRole: string;
    avatar: string;
    email: string;
    dateOfBirth: Date;
    status: boolean;
    unitId: number;
    deletedAt: Date;
    doet_id: number;
    role?: Role;
    province: any;
    hashPassword(): Promise<void>;
    workUnit?: string;
}
