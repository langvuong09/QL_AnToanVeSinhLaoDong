import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from 'src/commons/guards/localStrategy';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ViewModule } from '../view/view.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { jwtOptions } from 'src/config';

@Global()
@Module({
  imports: [
    ConfigModule,
    UserModule,
    ViewModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        ...(await jwtOptions(configService)),
        signOptions: { expiresIn: '1d', issuer: 'vna@group.com.vn' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}