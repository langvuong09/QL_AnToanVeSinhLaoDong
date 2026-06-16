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

class FileDto {
  id?: string;
  originalFilename?: string;
  url?: string;
  secureUrl?: string;

  constructor(file?: Partial<FileDto>) {
    if (file) {
      this.id = file.id;
      this.originalFilename = file.originalFilename;
      this.url = file.url;
      this.secureUrl = file.secureUrl;
    }
  }
}

export class CurrentUser {
  id!: string;
  doet?: number | null;
  username?: string;
  fullName?: string;
  avatar?: FileDto | null;
  role!: role; 

  constructor(user?: Partial<any>) { 
    this.role = new role(); 
    this.avatar = null;
    
    if (user) {
      this.id = user.id;
      this.username = user.username;
      this.fullName = user.fullName;
      this.doet = user.doetId !== undefined ? user.doetId : (user.doet || null);
      
      if (user.avatar && typeof user.avatar === 'object') {
        this.avatar = new FileDto(user.avatar);
      } else if (user.avatar && typeof user.avatar === 'string') {
        this.avatar = new FileDto({ url: user.avatar, secureUrl: user.avatar });
      }
      
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
