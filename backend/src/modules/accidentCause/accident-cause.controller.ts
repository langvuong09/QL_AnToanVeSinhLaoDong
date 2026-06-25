import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Patch, Query, UseGuards, BadRequestException } from "@nestjs/common";
import { ApiBody, ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { AuthGuard } from "src/commons/guards/authGuard";
import { PermissionGuard } from "src/commons/guards/permissionGuard";
import { PermissionCode } from "src/commons/enums/permission.enum";
import { RequirePermissions } from "src/commons/guards/permission.decorator";
import { AccidentCauseService } from "./accident-cause.service";
import { CreateAccidentCauseDto } from "./dto/create-accident-cause.dto";
import { UpdateAccidentCauseDto } from "./dto/update-accident-cause.dto";
import { AccidentCauseType } from "src/commons/enums/cause-type.enum";
import { ApiQuery } from "@nestjs/swagger";

@ApiTags('Accident Causes (Nguyên nhân tai nạn lao động)')
@Controller('accident-causes')
@UseGuards(AuthGuard, PermissionGuard)
@ApiBearerAuth()
export class AccidentCauseController {
  constructor(private readonly service: AccidentCauseService) {}

  @Post()
  @RequirePermissions(PermissionCode.ACCIDENT_CAUSE_CREATE)
  async create(@Body() dto: CreateAccidentCauseDto) { return await this.service.create(dto); }

  @Get('admin')
  @RequirePermissions(PermissionCode.ACCIDENT_CAUSE_VIEW)
  @ApiOperation({ summary: 'Lấy danh sách nguyên nhân cho Admin (Toàn bộ)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 10 })
  @ApiQuery({ name: 'code', required: false })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'type', required: false, enum: AccidentCauseType, description: 'EMPLOYER hoặc EMPLOYEE' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  async getAllForAdmin(@Query() query: any) { return await this.service.getAllForAdmin(query); }

  @Get('business')
  @RequirePermissions(PermissionCode.ACCIDENT_CAUSE_VIEW)
  @ApiOperation({ summary: 'Lấy danh sách nguyên nhân cho Business (Chỉ Active)' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'pageSize', required: false, example: 10 })
  @ApiQuery({ name: 'code', required: false })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'type', required: false, enum: AccidentCauseType })
  async getAllForBusiness(@Query() query: any) { return await this.service.getAllForBusiness(query); }
  
  @Post('bulk-delete')
  @RequirePermissions(PermissionCode.ACCIDENT_CAUSE_DELETE)
  @ApiOperation({ summary: 'Xóa hàng loạt nguyên nhân tai nạn' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ids: { type: 'array', items: { type: 'integer' }, example: [1, 2, 3], description: 'Mảng các ID ngành nghề kinh doanh cần xóa' }
      },
      required: ['ids']
    }
  })
  async bulkDelete(@Body('ids') ids: number[]) { 
    if (!ids || ids.length === 0) {
      throw new BadRequestException('Danh sách ID không được để trống');
    }
    return await this.service.bulkRemove(ids); 
  }


  @Put(':id')
  @RequirePermissions(PermissionCode.ACCIDENT_CAUSE_UPDATE)
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAccidentCauseDto) {
    return await this.service.update(id, dto);
  }

  @Get(':id')
  @RequirePermissions(PermissionCode.ACCIDENT_CAUSE_VIEW)
  @ApiOperation({ summary: 'Lấy chi tiết một nguyên nhân tai nạn' })
  async getDetail(@Param('id', ParseIntPipe) id: number) {
    return await this.service.getDetail(id);
  }

  @Patch(':id/toggle-active')
  @ApiOperation({ summary: 'Bật/Tắt trạng thái hoạt động' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        isActive: { type: 'boolean', example: true }
      },
      required: ['isActive']
    }
  })
  @RequirePermissions(PermissionCode.ACCIDENT_CAUSE_UPDATE)
  @ApiOperation({ summary: 'Chuyển đổi trạng thái Active/Inactive' })
  async toggleActive(@Param('id', ParseIntPipe) id: number, @Body('isActive') isActive: boolean) {
    return await this.service.toggleActive(id, isActive);
  }
}