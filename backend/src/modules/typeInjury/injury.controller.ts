import { 
  Body, 
  Controller, 
  Get, 
  Param, 
  Post, 
  Put, 
  Query, 
  ParseIntPipe, 
  UseGuards, 
  Patch 
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateInjuryTypeDto } from './dto/create-injury-type.dto';
import { UpdateInjuryTypeDto } from './dto/update-injury-type.dto';
import { AuthGuard } from '../../commons/guards/authGuard';
import { PermissionGuard } from '../../commons/guards/permissionGuard';
import { InjuryTypeService } from './injury.service';
import { PermissionCode } from 'src/commons/enums/permission.enum';
import { RequirePermissions } from 'src/commons/guards/permission.decorator';

@ApiTags('Injury Types (Danh mục loại chấn thương)')
@Controller('injury-types')
@UseGuards(AuthGuard, PermissionGuard) 
@ApiBearerAuth()
export class InjuryTypeController {
  constructor(private readonly injuryTypeService: InjuryTypeService) {}

  @Post()
  @RequirePermissions(PermissionCode.INJURY_TYPE_CREATE)
  @ApiOperation({ summary: '🎯 Tạo mới một loại chấn thương' })
  @ApiBody({ type: CreateInjuryTypeDto })
  async create(@Body() dto: CreateInjuryTypeDto) {
    return await this.injuryTypeService.create(dto);
  }

  @Put(':id')
  @RequirePermissions(PermissionCode.INJURY_TYPE_UPDATE)
  @ApiOperation({ summary: '🎯 Cập nhật thông tin loại chấn thương' })
  @ApiBody({ type: UpdateInjuryTypeDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateInjuryTypeDto
  ) {
    return await this.injuryTypeService.update(id, dto);
  }

  @Get('admin')
  @RequirePermissions(PermissionCode.INJURY_TYPE_VIEW)
  @ApiOperation({ summary: '🎯 Lấy danh sách chấn thương cho Admin (Trả về dạng Cây hoặc danh sách phẳng tùy điều kiện lọc)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Trang hiện tại (Mặc định: 1)' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'Số bản ghi mỗi trang (Mặc định: 10)' })
  @ApiQuery({ name: 'code', required: false, type: String, description: 'Tìm kiếm theo mã chấn thương' })
  @ApiQuery({ name: 'name', required: false, type: String, description: 'Tìm kiếm theo tên chấn thương' })
  @ApiQuery({ name: 'level', required: false, type: Number, description: 'Lọc chính xác theo cấp độ (1, 2, 3...)' })
  async getAllForAdmin(@Query() query: { page?: number; pageSize?: number; code?: string; name?: string; level?: number }) {
    return await this.injuryTypeService.getAllForAdmin(query);
  }

  @Get('app')
  @RequirePermissions(PermissionCode.INJURY_TYPE_VIEW)
  @ApiOperation({ summary: '🎯 Lấy danh sách chấn thương đang hoạt động hiển thị lên phía Client/App' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'code', required: false, type: String })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'level', required: false, type: Number })
  async getAllForUser(@Query() query: { page?: number; pageSize?: number; code?: string; name?: string; level?: number }) {
    return await this.injuryTypeService.getAllForUser(query);
  }

  @Get(':id')
  @RequirePermissions(PermissionCode.INJURY_TYPE_VIEW) 
  @ApiOperation({ summary: '🎯 Lấy chi tiết thông tin một loại chấn thương' })
  async getDetail(@Param('id', ParseIntPipe) id: number) {
    return await this.injuryTypeService.getDetail(id);
  }

  @Patch(':id/toggle-active')
  @RequirePermissions(PermissionCode.INJURY_TYPE_UPDATE) 
  @ApiOperation({ summary: '🎯 Bật/Tắt trạng thái hoạt động (isActive) nhanh' })
  @ApiBody({ 
    schema: { 
      type: 'object', 
      properties: { isActive: { type: 'boolean', example: true } } 
    } 
  })
  async toggleActive(
    @Param('id', ParseIntPipe) id: number,
    @Body('isActive') isActive: boolean
  ) {
    return await this.injuryTypeService.toggleActive(id, isActive);
  }

  @Post('bulk-delete')
  @RequirePermissions(PermissionCode.INJURY_TYPE_DELETE)
  @ApiOperation({ summary: '🎯 Xóa mềm hàng loạt chấn thương (Tự động quét sạch các con cháu đệ quy phía dưới)' })
  @ApiBody({ 
    schema: { 
      type: 'object', 
      properties: { ids: { type: 'array', items: { type: 'number' }, example: [1, 2, 3] } } 
    } 
  })
  async bulkDelete(@Body('ids') ids: number[]) {
    return await this.injuryTypeService.bulkRemove(ids);
  }
}