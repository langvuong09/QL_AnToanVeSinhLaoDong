"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginModel = exports.CurrentUser = void 0;
class role {
    id;
    role;
    name;
    constructor(role, keys = ["id", "role", "name"]) {
        role && keys.forEach(key => {
            role[key] !== undefined && (this[key] = role[key]);
        });
    }
}
class CurrentUser {
    id;
    doet;
    username;
    fullname;
    realRole;
    avatar;
    role;
    constructor(user, keys = ["id", "username", "fullname", "realRole", "role", "avatar", "unitId", "workUnit"]) {
        user && keys.forEach(key => {
            if (key == "role") {
                user[key] !== undefined && (this[key] = new role(user[key]));
            }
            else {
                user[key] !== undefined && (this[key] = user[key]);
            }
        });
    }
}
exports.CurrentUser = CurrentUser;
class LoginModel {
    token;
    user;
    views;
    constructor(token, loginModel, keys = ["token", "views", "user"]) {
        this.token = token;
        loginModel && keys.forEach(key => {
            loginModel[key] !== undefined && (this[key] = loginModel[key]);
        });
    }
}
exports.LoginModel = LoginModel;
//# sourceMappingURL=auth.model.js.map