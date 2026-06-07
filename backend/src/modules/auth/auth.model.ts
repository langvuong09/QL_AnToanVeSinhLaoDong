class role { 
    id?: number;
    role?: string;
    name?: string;

    constructor(role?: Partial<role>, keys: string[] = ["id", "role", "name"]) {
        role && keys.forEach(key => {
            role[key] !== undefined && (this[key] = role[key]);
        });
    }
}

export class CurrentUser {
    id?: string;
    doet?: number | null;
    username?: string;
    fullname?: string;
    realRole?: string;
    avatar?: string;
    role?: role;

    constructor(user?: Partial<CurrentUser>, keys: string[] = ["id", "username", "fullname", "realRole", "role", "avatar", "unitId", "workUnit"]) {
        user && keys.forEach(key => {
            if (key == "role") {
                user[key] !== undefined && (this[key] = new role(user[key]));
            } else {
                user[key] !== undefined && (this[key] = user[key]);
            }
        })
    }
}

export class LoginModel {
    token: string;
    user?: CurrentUser;
    views: any;

    constructor(token: string, loginModel?: Partial<LoginModel>, keys: string[] = ["token", "views", "user"]) {
        this.token = token;
        loginModel && keys.forEach(key => {
                loginModel[key] !== undefined && (this[key] = loginModel[key]);
        });
    }
}