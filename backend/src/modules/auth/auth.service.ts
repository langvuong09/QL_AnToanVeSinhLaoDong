import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import Response, { ResponseData } from "src/commons/response";
import { ViewService } from "../view/view.service";
import { CurrentUser, LoginModel } from "./auth.model";
import { get } from "lodash";
import { Doet } from "../doet/doet.entity";
import { User } from "../user/user.entity";
import { getManager } from "typeorm";
import { extractHostname } from "src/commons/helper/Domain";
import * as fs from "fs";
import * as path from "path";
import Email from "../../commons/helper/Email";
import * as argon from "argon2";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly viewService: ViewService
  ) {
  }

  async login(data: any, doet: Doet | null): Promise<ResponseData<LoginModel>> {
    try {
      const _doet = doet && doet.id ? doet.id : null;
      const user = new CurrentUser(_doet, data);
      const [views, token] = await Promise.all([
        await this.viewService.getViewsByRoleId(user.role.id),
        await this.jwtService.sign({ ...user })
      ]);
      const rs = new LoginModel({
        token,
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
      const user = new CurrentUser(_doet, await this.jwtService.verifyAsync(token));
      const views = await this.viewService.getViewsByRoleId(user.role.id);
      const rs = new LoginModel({
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
      const manage = getManager();
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
      const manage = getManager();
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