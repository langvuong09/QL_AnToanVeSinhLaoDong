import { Role } from "../role/role.entity";
import { Doet } from "../doet/doet.entity";
import { FileEntity } from "../media/media.entity";
import { BaseAddressEntity } from "../../commons/bases/baseAddressEntity";
export declare class User extends BaseAddressEntity {
    id: string;
    username: string;
    password: string;
    fullName: string;
    email: string;
    dateOfBirth: Date;
    status: boolean;
    roleId: number;
    role?: Role;
    avatarId: string;
    avatar?: FileEntity;
    doetId: number;
    doet?: Doet;
    hashPassword(): Promise<void>;
}
