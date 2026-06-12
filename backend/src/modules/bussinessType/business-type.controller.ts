import { 
  Body, Controller, Get, Param, Post, Put, Query, Patch, ParseIntPipe, UseGuards, UseInterceptors, ClassSerializerInterceptor
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BusinessTypeService } from './business-type.service';
import { CreateBusinessTypeDto } from './dto/create-business-type.dto';
import { UpdateBusinessTypeDto } from './dto/update-business-type.dto';
import { AuthGuard } from "../../commons/guards/authGuard";
import { PermissionGuard } from 'src/commons/guards/permissionGuard';
import { PermissionCode } from 'src/commons/enums/permission.enum';
import { RequirePermissions } from 'src/commons/guards/permission.decorator';

@ApiTags('Business Types (Loại hình doanh nghiệp)')
@Controller('business-types')
@UseGuards(AuthGuard, PermissionGuard)
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class BusinessTypeController {
  constructor(private readonly businessTypeService: BusinessTypeService) {}

  @Post()
  @RequirePermissions(PermissionCode.BUSINESS_TYPE_CREATE)
  @ApiOperation({ summary: 'Tạo mới loại hình doanh nghiệp' })
  async create(@Body() dto: CreateBusinessTypeDto) {
    return await this.businessTypeService.create(dto);
  }

  @Get('admin')
  @RequirePermissions(PermissionCode.BUSINESS_TYPE_UPDATE)
  @ApiOperation({ summary: 'Lấy danh sách loại hình doanh nghiệp (Dành cho Admin - Bộ lọc độc lập)' })
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Số trang hiện tại' })
  @ApiQuery({ name: 'pageSize', required: false, example: 10, description: 'Số lượng bản ghi trên một trang' })
  @ApiQuery({ name: 'code', required: false, description: 'Tìm kiếm gần đúng theo mã loại hình (Ví dụ: 150)' })
  @ApiQuery({ name: 'name', required: false, description: 'Tìm kiếm gần đúng theo tên loại hình (Ví dụ: Công ty TNHH)' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Lọc trạng thái hoạt động (true = Đang hoạt động, false = Bị ẩn)' })
  async getAllForAdmin(
    @Query() query: { page?: number; pageSize?: number; code?: string; name?: string; isActive?: boolean }
  ) {
    return await this.businessTypeService.getAllForAdmin(query);
  }

  @Get()
  @RequirePermissions(PermissionCode.BUSINESS_TYPE_VIEW)
  @ApiOperation({ summary: 'Lấy danh sách loại hình doanh nghiệp đang hoạt động (Dành cho Doanh nghiệp - Lọc độc lập)' })
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Số trang hiện tại' })
  @ApiQuery({ name: 'pageSize', required: false, example: 10, description: 'Số lượng bản ghi trên một trang' })
  @ApiQuery({ name: 'code', required: false, description: 'Tìm kiếm gần đúng theo mã loại hình' })
  @ApiQuery({ name: 'name', required: false, description: 'Tìm kiếm gần đúng theo tên loại hình' })
  async getAllForBusiness(
    @Query() query: { page?: number; pageSize?: number; code?: string; name?: string }
  ) {
    return await this.businessTypeService.getAllForBusiness(query);
  }

  @Get(':id')
  @RequirePermissions(PermissionCode.BUSINESS_TYPE_VIEW)
  @ApiOperation({ summary: 'Lấy chi tiết loại hình doanh nghiệp' })
  async getDetail(@Param('id', ParseIntPipe) id: number) {
    return await this.businessTypeService.getDetail(id);
  }

  @Put(':id')
  @RequirePermissions(PermissionCode.BUSINESS_TYPE_UPDATE)
  @ApiOperation({ summary: 'Cập nhật thông tin loại hình doanh nghiệp' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBusinessTypeDto,
  ) {
    return await this.businessTypeService.update(id, dto);
  }

  @Patch(':id/active')
  @RequirePermissions(PermissionCode.BUSINESS_TYPE_UPDATE)
  @ApiOperation({ summary: 'Bật/Tắt trạng thái hoạt động' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        isActive: { type: 'boolean', example: true, description: 'Trạng thái hoạt động' }
      },
      required: ['isActive']
    }
  })
  async toggleActive(
    @Param('id', ParseIntPipe) id: number,
    @Body('isActive') isActive: boolean,
  ) {
    return await this.businessTypeService.toggleActive(id, isActive);
  }

  @Post('bulk-delete')
  @RequirePermissions(PermissionCode.BUSINESS_TYPE_DELETE)
  @ApiOperation({ summary: 'Xóa mềm hàng loạt loại hình kinh doanh' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ids: { type: 'array', items: { type: 'integer' }, example: [1, 2, 3], description: 'Mảng các ID loại hình kinh doanh cần xóa' }
      },
      required: ['ids']
    }
  })
  async bulkDelete(@Body('ids') ids: number[]) {
    return await this.businessTypeService.bulkRemove(ids);
  }
}