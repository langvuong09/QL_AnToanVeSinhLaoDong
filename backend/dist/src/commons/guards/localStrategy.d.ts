import { UserService } from "../../modules/user/user.service";
declare const LocalStrategy_base: any;
export declare class LocalStrategy extends LocalStrategy_base {
    private userService;
    constructor(userService: UserService);
    validate(request: any, username: string, password: string): Promise<any>;
}
export {};
