import {
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { ViewModule } from './modules/view/view.module';
import { MediaModule } from './modules/media/media.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DoetModule } from './modules/doet/doet.module';
import { dbOptions, load } from './config';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './helper/email.module';
import { UserModule } from './modules/user/user.module';
import { BusinessTypeModule } from './modules/bussinessType/business-type.module';
import { In } from 'typeorm';
import { IndustryModule } from './modules/industry/industry.module';
import { ReportTypeModule } from './modules/typeReport/report-type.module';
import { Trauma } from './modules/traumaFactor/trauma-factor.entity';
import { TraumaModule } from './modules/traumaFactor/trauma-factor.module';
import { InjuryTypeModule } from './modules/typeInjury/injury.module';
import { ReportModule } from './modules/report/report.module';
import { RoleModule } from './modules/role/role.module';
import { ScheduleModule } from '@nestjs/schedule/dist/schedule.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [load] }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: dbOptions,
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    MediaModule,
    ViewModule,
    RedisModule,
    EmailModule,
    UserModule,
    BusinessTypeModule,
    IndustryModule,
    DoetModule,
    TraumaModule,
    InjuryTypeModule,
    ReportTypeModule,
    ReportModule,
    RoleModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(DomainMiddleware).forRoutes('*');
  }
}
