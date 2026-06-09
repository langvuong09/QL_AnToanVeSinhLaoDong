import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import Response, { ResponseData } from "src/commons/response";
import { ViewService } from "../view/view.service";
import { CurrentUser, LoginModel } from "./auth.model";
import { get } from "lodash";
import { User } from "../user/user.entity";
import { DataSource } from "typeorm";
import { extractHostname } from "../../helper/Domain";
import * as fs from "fs";
import * as path from "path";
import * as argon from "argon2";
import { Doet } from "../doet/doet.entity";
import Email from "src/helper/Email";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly viewService: ViewService,
    private readonly dataSource: DataSource
  ) {
  }

  async login(data: any, doet: Doet | null): Promise<ResponseData<LoginModel>> {
    try {
      const _doet = doet && doet.id ? doet.id : null;
      const user = new CurrentUser({
        ...data,
        doet: _doet
      });
      const roleId = user.role?.id ?? 0;
      const [views, token] = await Promise.all([
        await this.viewService.getViewsByRoleId(roleId),
        await this.jwtService.sign({ ...user })
      ]);
      const rs = new LoginModel(token, {
        views: get(views, "data.items", [])
      });
      return Response.get<LoginModel>(rs);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  async validateToken(token: string, doet: Doet | null): Promise<ResponseData<LoginModel>> {
    try {
      const _doet = doet && doet.id ? doet.id : null;
      const decodedData = await this.jwtService.verifyAsync(token);
      const user = new CurrentUser({
        ...decodedData,
        doet: _doet
      });
      const roleId = user.role?.id ?? 0;
      const views = await this.viewService.getViewsByRoleId(roleId);
      const rs = new LoginModel(token, {
        user,
        views: get(views, "data.items", [])
      });

      return Response.get<LoginModel>(rs);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  async forgotPassword(email: string, domain: string) {
    try {
      const manage = this.dataSource.manager;
      const user = await manage.findOne(User, {
        where: {
          email: email
        }
      });
      if (!user) {
        return Response.errorNotFound("Not found email");
      }
      const _domain = extractHostname(domain);
      const codeEmail = this.jwtService.sign({
        email: email,
        id: user.id
      }, {
        expiresIn: "5m"
      });
      const URLReset = `https://${_domain}/reset-password?code=${codeEmail}`;
      const template = fs.readFileSync(
        path.resolve(
          __dirname,
          `${process.env.dirTemp}/forgot-password.html`
        ), {
          encoding: "utf-8"
        });

      await Email.sendMail(email, "Lấy lại mật khẩu", template
        .replace(/\$1/g, user.fullName)
        .replace(/\$2/g, user.username)
        .replace(/\$3/g, URLReset)
      );
      return Response.SUCCESSFULLY;
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }

  async resetPassword(code: string) {
    try {
      const data: any = this.jwtService.decode(code);
      const manage = this.dataSource.manager;
      const user = await manage.findOne(User, {
        where: {
          id: data.id
        }
      });
      if (!user) {
        return Response.errorNotFound("Not found email");
      }
      const _newPassword = await argon.hash('12345678');
      await manage.query(`update users
                                set password = '${_newPassword}'
                                where id = '${data.id}'`);
      return Response.SUCCESSFULLY;
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }
}