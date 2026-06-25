import { 
  Body, Controller, Get, Param, Post, Put, Query, ParseIntPipe, UseGuards, UseInterceptors, ClassSerializerInterceptor, 
  Patch
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateTraumaDto } from './dto/create-trauma.dto';
import { UpdateTraumaDto } from './dto/update-trauma.dto';
import { AuthGuard } from "../../commons/guards/authGuard";
import { PermissionGuard } from 'src/commons/guards/permissionGuard';
import { PermissionCode } from 'src/commons/enums/permission.enum';
import { RequirePermissions } from 'src/commons/guards/permission.decorator';
import { TraumaService } from './trauma-factor.service';
import { AccidentCauseType } from 'src/commons/enums/cause-type.enum';

@ApiTags('Trauma Factors (Yếu tố gây chấn thương)')
@Controller('trauma-factors')
@UseGuards(AuthGuard, PermissionGuard)
@ApiBearerAuth()
export class TraumaController {
  constructor(private readonly traumaService: TraumaService) {}

  @Post()
  @RequirePermissions(PermissionCode.TRAUMA_FACTOR_CREATE)
  async create(@Body() dto: CreateTraumaDto) { return await this.traumaService.create(dto); }

  @Put(':id')
  @RequirePermissions(PermissionCode.TRAUMA_FACTOR_UPDATE)
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTraumaDto) {
    return await this.traumaService.update(id, dto);
  }

  @Patch(':id/toggle-active')
  @RequirePermissions(PermissionCode.TRAUMA_FACTOR_UPDATE)
  @ApiOperation({ summary: 'Chuyển đổi trạng thái hoạt động (Active/Inactive)' })
  async toggleActive(@Param('id', ParseIntPipe) id: number, @Body('isActive') isActive: boolean) {
    return await this.traumaService.toggleActive(id, isActive);
  }

  @Get('admin')
  @RequirePermissions(PermissionCode.TRAUMA_FACTOR_VIEW)
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 10 })
  @ApiQuery({ name: 'code', required: false })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'type', required: false, enum: AccidentCauseType, description: 'EMPLOYER hoặc EMPLOYEE' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  async getAllForAdmin(@Query() query: any) { return await this.traumaService.getAllForAdmin(query); }

  @Get('business')
  @RequirePermissions(PermissionCode.TRAUMA_FACTOR_VIEW)
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 10 })
  @ApiQuery({ name: 'code', required: false })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'type', required: false, enum: AccidentCauseType, description: 'EMPLOYER hoặc EMPLOYEE' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  async getAllForBusiness(@Query() query: any) { return await this.traumaService.getAllForBusiness(query); }

  @Get(':id')
  @RequirePermissions(PermissionCode.TRAUMA_FACTOR_VIEW)
  async getDetail(@Param('id', ParseIntPipe) id: number) { return await this.traumaService.getDetail(id); }

  @Post('bulk-delete')
  @RequirePermissions(PermissionCode.TRAUMA_FACTOR_DELETE)
  @ApiQuery({ name: 'ids', required: true, type: [Number] })
  @ApiOperation({ summary: 'Xóa hàng loạt yếu tố gây chấn thương' })
  async bulkDelete(@Body('ids') ids: number[]) { return await this.traumaService.bulkRemove(ids); }
}