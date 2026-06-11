declare class role {
    id?: number;
    code?: string;
    name?: string;
    constructor(role?: Partial<role>, keys?: string[]);
}
export declare class CurrentUser {
    id: string;
    doet?: number | null;
    username?: string;
    fullname?: string;
    avatar?: string;
    role: role;
    constructor(user?: Partial<CurrentUser>);
}
export declare class LoginModel {
    token: string;
    refreshToken?: string;
    user?: CurrentUser;
    views: any;
    constructor(token: string, refreshToken?: string | null, loginModel?: Partial<LoginModel>, keys?: string[]);
}
export {};
