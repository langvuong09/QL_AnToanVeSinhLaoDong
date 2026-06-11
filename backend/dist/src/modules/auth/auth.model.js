"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginModel = exports.CurrentUser = void 0;
class role {
    id;
    code;
    name;
    constructor(role, keys = ['id', 'code', 'name']) {
        role &&
            keys.forEach((key) => {
                role[key] !== undefined && (this[key] = role[key]);
            });
    }
}
class CurrentUser {
    id;
    doet;
    username;
    fullname;
    avatar;
    role;
    constructor(user) {
        this.role = new role();
        if (user) {
            Object.assign(this, user);
            if (user.role) {
                this.role = new role(user.role);
            }
        }
    }
}
exports.CurrentUser = CurrentUser;
class LoginModel {
    token;
    refreshToken;
    user;
    views;
    constructor(token, refreshToken, loginModel, keys = ['token', 'refreshToken', 'views', 'user']) {
        this.token = token;
        if (refreshToken) {
            this.refreshToken = refreshToken;
        }
        loginModel &&
            keys.forEach((key) => {
                if (loginModel[key] !== undefined) {
                    this[key] = loginModel[key];
                }
            });
    }
}
exports.LoginModel = LoginModel;
//# sourceMappingURL=auth.model.js.map