import {
  ClassSerializerInterceptor,
  Controller,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
  Body,
  Req,
  Get,
  Query
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { LocalAuthGuard } from "../../commons/guards/localAuthGuard";
import { LoginModel } from "./auth.model";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { ForgotPasswordDto } from "./dto/forgot-password.dto";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post("login")
  @UseGuards(LocalAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({
    summary: "Login with username and password"
  })
  @ApiBody({ type: LoginDto })
  async login(@Request() req) {
    return this.authService.login(req.user, req.doet);
  }


  @Post("forgot-password")
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiBody({ type: ForgotPasswordDto })
  async forgotPassword(
    @Body("email") email: string,
    @Req() req: any
  ) {
    const domain = req.get("origin") || req.get("host");
    return this.authService.forgotPassword(email, domain);
  }

  @Get("reset-password")
  @UseInterceptors(ClassSerializerInterceptor)
  async resetPassword(
    @Query("code") code: string
  ) {
    return this.authService.resetPassword(code);
  }
}