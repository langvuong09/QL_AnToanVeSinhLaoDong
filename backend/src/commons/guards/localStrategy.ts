import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException, NotFoundException, NotAcceptableException } from "@nestjs/common";
import { UserService } from "src/modules/user/user.service";
import { get } from "lodash";
import * as argon from "argon2";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      passReqToCallback: true
    });
  }

  async validate(
    request: any,
    username: string,
    password: string
  ): Promise<any> {
    const _where: any = { username: username };
    if (request.doet?.id) {
      _where.doetId = request.doet.id;
    }

    const { data } = await this.userService.get({
      where: JSON.stringify(_where),
      relation: JSON.stringify(["role", "doet"])
    });

    const user = get(data, "items[0]");

    if (!user || user.deletedAt) {
      throw new NotFoundException({ code: 3033, message: 'Account not found' });
    }
    
    if (user.status === false || (user.doet && user.doet.status === false)) {
      throw new NotAcceptableException({ code: 3035, message: 'Account is locked' });
    }

    const isMatch = await argon.verify(user.password, password);
    if (!isMatch) {
      throw new UnauthorizedException({ code: 3034, message: 'Wrong password' });
    }

    return user;
  }
}