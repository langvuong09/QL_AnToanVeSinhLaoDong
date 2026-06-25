import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm/dist/typeorm.module";
import { AccidentCause } from "./accident-cause.entity";
import { AccidentCauseController } from "./accident-cause.controller";
import { AccidentCauseService } from "./accident-cause.service";
import { PermissionModule } from "../permission/permission.module";

@Module({
  imports: [TypeOrmModule.forFeature([AccidentCause]), PermissionModule],
  controllers: [AccidentCauseController],
  providers: [AccidentCauseService],
  exports: [AccidentCauseService],
})
export class AccidentCauseModule {}