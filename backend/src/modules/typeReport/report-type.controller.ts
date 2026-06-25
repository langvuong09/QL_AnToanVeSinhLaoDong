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
import { ReportTypeService } from './report-type.service';
import { CreateReportTypeDto } from './dto/create-report-type.dto';
import { UpdateReportTypeDto } from './dto/update-report-type.dto';
import { AuthGuard } from '../../commons/guards/authGuard';
import { PermissionGuard } from '../../commons/guards/permissionGuard';
import { RequirePermissions } from 'src/commons/guards/permission.decorator';
import { PermissionCode } from 'src/commons/enums/permission.enum';

@ApiTags('Report Types (Cấu hình thời gian báo cáo)')
@Controller('report-types')
@UseGuards(AuthGuard, PermissionGuard)
@ApiBearerAuth()
export class ReportTypeController {
  constructor(private readonly reportTypeService: ReportTypeService) {}

  @Post()
  @RequirePermissions(PermissionCode.REPORT_TYPE_CREATE)
  @ApiOperation({ summary: '🎯 Tạo mới một cấu hình thời gian báo cáo' })
  async create(@Body() dto: CreateReportTypeDto) {
    return await this.reportTypeService.create(dto);
  }

  @Put(':id')
  @RequirePermissions(PermissionCode.REPORT_TYPE_UPDATE)
  @ApiOperation({ summary: '🎯 Cập nhật thông tin cấu hình báo cáo' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReportTypeDto
  ) {
    return await this.reportTypeService.update(id, dto);
  }

  @Get('admin')
  @RequirePermissions(PermissionCode.REPORT_TYPE_VIEW)
  @ApiOperation({ summary: '🎯 Lấy danh sách cấu hình báo cáo dành cho Admin (Có đầy đủ bộ lọc tìm kiếm trên UI)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'year', required: false, type: Number, description: 'Tìm theo ô Năm báo cáo' })
  @ApiQuery({ name: 'name', required: false, type: String, description: 'Tìm theo ô Tên báo cáo' })
  @ApiQuery({ name: 'period', required: false, type: String, description: 'Tìm theo ô Kỳ báo cáo' })
  @ApiQuery({ name: 'startDate', required: false, type: String, description: 'Định dạng YYYY-MM-DD' })
  @ApiQuery({ name: 'endDate', required: false, type: String, description: 'Định dạng YYYY-MM-DD' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Lọc trạng thái switch' })
  async getAllForAdmin(@Query() query: any) {
    return await this.reportTypeService.getAllForAdmin(query);
  }

  @Get('business')
  @RequirePermissions(PermissionCode.REPORT_TYPE_VIEW)
  @ApiOperation({ summary: '🎯 Lấy danh sách cấu hình đang kích hoạt dành cho Doanh nghiệp nộp báo cáo' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiQuery({ name: 'name', required: false, type: String })
  @ApiQuery({ name: 'period', required: false, type: String })
  async getAllForBusiness(@Query() query: any) {
    return await this.reportTypeService.getAllForBusiness(query);
  }

  @Get(':id')
  @RequirePermissions(PermissionCode.REPORT_TYPE_VIEW)
  @ApiOperation({ summary: '🎯 Xem chi tiết cấu hình báo cáo' })
  async getDetail(@Param('id', ParseIntPipe) id: number) {
    return await this.reportTypeService.getDetail(id);
  }

  @Patch(':id/toggle-active')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        isActive: { 
          type: 'boolean', 
          example: true, 
          description: 'Trạng thái hoạt động (true: Kích hoạt, false: Ngưng hoạt động)' 
        }
      },
      required: ['isActive']
    }
  })
  @RequirePermissions(PermissionCode.REPORT_TYPE_UPDATE)
  @ApiOperation({ summary: '🎯 Thay đổi nhanh trạng thái Kích hoạt/Ngưng hoạt động bằng Switch trên UI' })
  async toggleActive(
    @Param('id', ParseIntPipe) id: number,
    @Body('isActive') isActive: boolean
  ) {
    return await this.reportTypeService.toggleActive(id, isActive);
  }
}