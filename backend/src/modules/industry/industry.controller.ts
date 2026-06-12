import { 
  Body, Controller, Get, Param, Post, Put, Query, Patch, ParseIntPipe, UseGuards, UseInterceptors, ClassSerializerInterceptor, 
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { IndustryService } from './industry.service';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { UpdateIndustryDto } from './dto/update-industry.dto';
import { AuthGuard } from "../../commons/guards/authGuard";
import { PermissionGuard } from 'src/commons/guards/permissionGuard';
import { PermissionCode } from 'src/commons/enums/permission.enum';
import { RequirePermissions } from 'src/commons/guards/permission.decorator';

@ApiTags('Industries (Ngành nghề kinh doanh)')
@Controller('industries')
@UseGuards(AuthGuard, PermissionGuard)
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class IndustryController {
  constructor(private readonly industryService: IndustryService) {}

  @Post()
  @RequirePermissions(PermissionCode.INDUSTRY_CREATE)
  @ApiOperation({ summary: 'Tạo mới ngành nghề kinh doanh' })
  async create(@Body() dto: CreateIndustryDto) {
    return await this.industryService.create(dto);
  }

  @Get('admin')
  @RequirePermissions(PermissionCode.INDUSTRY_UPDATE)
  @ApiOperation({ summary: 'Lấy toàn bộ danh sách ngành nghề (Dành cho Admin - Có cả phần tử ẩn)' })
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Số trang hiện tại' })
  @ApiQuery({ name: 'pageSize', required: false, example: 10, description: 'Số lượng bản ghi trên một trang' })
  @ApiQuery({ name: 'code', required: false, description: 'Tìm chính xác hoặc gần đúng theo Mã ngành (Ví dụ: 01, 0111)' })
  @ApiQuery({ name: 'name', required: false, description: 'Tìm gần đúng theo Tên ngành nghề (Ví dụ: Trồng lúa)' })
  @ApiQuery({ name: 'level', required: false, enum: [1, 2, 3, 4], description: 'Lọc đích danh theo cấp bậc ngành (1 -> 4)' })
  async getAllForAdmin(
    @Query() query: { page?: number; pageSize?: number; code?: string; name?: string; level?: number }
  ) {
    return await this.industryService.getAllForAdmin(query);
  }

  @Get()
  @RequirePermissions(PermissionCode.INDUSTRY_VIEW)
  @ApiOperation({ summary: 'Lấy danh sách ngành nghề đang hoạt động (Dành cho Doanh nghiệp)' })
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Số trang hiện tại' })
  @ApiQuery({ name: 'pageSize', required: false, example: 10, description: 'Số lượng bản ghi trên một trang' })
  @ApiQuery({ name: 'code', required: false, description: 'Tìm chính xác hoặc gần đúng theo Mã ngành' })
  @ApiQuery({ name: 'name', required: false, description: 'Tìm gần đúng theo Tên ngành nghề' })
  @ApiQuery({ name: 'level', required: false, enum: [1, 2, 3, 4], description: 'Lọc đích danh theo cấp bậc ngành (1 -> 4)' })
  async getAllForBusiness(
    @Query() query: { page?: number; pageSize?: number; code?: string; name?: string; level?: number }
  ) {
    return await this.industryService.getAllForBusiness(query);
  }

  @Get(':id')
  @RequirePermissions(PermissionCode.INDUSTRY_VIEW)
  @ApiOperation({ summary: 'Lấy chi tiết ngành nghề' })
  async getDetail(@Param('id', ParseIntPipe) id: number) {
    return await this.industryService.getDetail(id);
  }

  @Put(':id')
  @RequirePermissions(PermissionCode.INDUSTRY_UPDATE)
  @ApiOperation({ summary: 'Cập nhật thông tin ngành nghề' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateIndustryDto,
  ) {
    return await this.industryService.update(id, dto);
  }

  @Patch(':id/active')
  @RequirePermissions(PermissionCode.INDUSTRY_UPDATE)
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
  async toggleActive(
    @Param('id', ParseIntPipe) id: number,
    @Body('isActive') isActive: boolean,
  ) {
    return await this.industryService.toggleActive(id, isActive);
  }

  @Post('bulk-delete')
  @RequirePermissions(PermissionCode.INDUSTRY_DELETE)
  @ApiOperation({ summary: 'Xóa mềm hàng loạt ngành nghề kinh doanh' })
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
    return await this.industryService.bulkRemove(ids);
  }
}