class role {
  id?: number;
  code?: string;
  name?: string;

  constructor(role?: Partial<role>, keys: string[] = ['id', 'code', 'name']) {
    role &&
      keys.forEach((key) => {
        role[key] !== undefined && (this[key] = role[key]);
      });
  }
}

export class CurrentUser {
  id!: string;
  doet?: number | null;
  username?: string;
  fullname?: string;
  avatar?: string;
  role!: role; 

  constructor(user?: Partial<CurrentUser>) {
    this.role = new role(); 
    
    if (user) {
      Object.assign(this, user);
      if (user.role) {
        this.role = new role(user.role);
      }
    }
  }
}

export class LoginModel {
  token: string;
  refreshToken?: string;
  user?: CurrentUser;
  views: any;

  constructor(
    token: string,
    refreshToken?: string | null,
    loginModel?: Partial<LoginModel>,
    keys: string[] = ['token', 'refreshToken', 'views', 'user'],
  ) {
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
