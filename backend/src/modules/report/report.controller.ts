import { Body, Controller, Get, Param, Post, Query, ParseIntPipe, UseGuards, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ReportService } from './report.service';
import { CreateReportDto, ReportDetailDto } from './dto/create-report.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { AuthGuard } from '../../commons/guards/authGuard';
import { PermissionGuard } from '../../commons/guards/permissionGuard';
import { RequirePermissions } from 'src/commons/guards/permission.decorator';
import { GetUser } from 'src/commons/guards/user.decorator';
import { PermissionCode } from 'src/commons/enums/permission.enum';
import { UpdateReportDto } from './dto/update-report.dto';
import { ApiExtraModels } from '@nestjs/swagger';
import { BulkUpdateStatusDto } from './dto/bulk-update-status.dto';


@ApiTags('Reports (Quản lý và tổng hợp báo cáo Tai nạn lao động)')
@Controller('reports')
@UseGuards(AuthGuard, PermissionGuard)
@ApiExtraModels(CreateReportDto, UpdateReportDto, ReportDetailDto)
@ApiBearerAuth()
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  @RequirePermissions(PermissionCode.REPORT_CREATE)
  @ApiOperation({ summary: '🎯 Doanh nghiệp khởi tạo bản nháp báo cáo định kỳ (Kèm đính kèm tài liệu)' })
  async createReport(@Body() dto: CreateReportDto, @GetUser() user: any) {
    return await this.reportService.createReport(dto, user);
  }

  @Put(':id/status')
  @RequirePermissions(PermissionCode.REPORT_CHANGE_STATUS)
  @ApiOperation({ summary: '🎯 Điều chuyển trạng thái báo cáo tuần tự nghiêm ngặt (DRAFT -> SUBMITTED -> APPROVED / REJECTED)' })
  async changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStatusDto,
    @GetUser() user: any
  ) {
    return await this.reportService.changeStatus(id, dto, user);
  }

  @Put('bulk/status')
  @RequirePermissions(PermissionCode.REPORT_CHANGE_STATUS)
  @ApiOperation({ summary: '🎯 Duyệt/Thay đổi trạng thái hàng loạt cho nhiều báo cáo cùng lúc' })
  async changeStatusBulk(
    @Body() dto: BulkUpdateStatusDto,
    @GetUser() user: any
  ) {
    return await this.reportService.changeStatusBulk(dto, user);
  }

  @Put(':id')
  @RequirePermissions(PermissionCode.REPORT_UPDATE) 
  @ApiOperation({ summary: '🎯 Doanh nghiệp cập nhật sửa đổi nội dung bản nháp/bản bị từ chối (Chỉ sửa được khi trạng thái là DRAFT hoặc REJECTED)' })
  async updateReport(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReportDto & { status?: string },
    @GetUser() user: any
  ) {
    return await this.reportService.updateReport(id, dto, user);
  }

  @Get('admin')
  @RequirePermissions(PermissionCode.REPORT_VIEW)
  @ApiOperation({ summary: '🎯 Cấp Quản lý (Admin) tra cứu danh sách báo cáo toàn thành phố' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'taxCode', required: false, type: String })
  @ApiQuery({ name: 'businessName', required: false, type: String })
  @ApiQuery({ name: 'period', required: false, type: String })
  @ApiQuery({ name: 'province', required: false, type: String, description: 'Lọc sâu theo Tỉnh/Thành phố' })
  @ApiQuery({ name: 'district', required: false, type: String, description: 'Lọc sâu theo Quận/Huyện' })
  @ApiQuery({ name: 'ward', required: false, type: String, description: 'Lọc sâu theo Phường/Xã' })
  async getAllForAdmin(@Query() query: any) {
    return await this.reportService.getAllForAdmin(query);
  }

  @Get('my-reports')
  @RequirePermissions(PermissionCode.REPORT_VIEW)
  @ApiOperation({ summary: '🎯 Doanh nghiệp tự tra cứu lịch sử nộp báo cáo của chính mình (Tự động lọc theo user.doetId)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  @ApiQuery({ name: 'year', required: false, type: Number })
  @ApiQuery({ name: 'period', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  async getAllForBusiness(@Query() query: any, @GetUser() user: any) {
    return await this.reportService.getAllForBusiness(query, user);
  }

  @Get(':id/fe-table')
  @RequirePermissions(PermissionCode.REPORT_VIEW)
  @ApiOperation({ summary: '🎯 Lấy dữ liệu chi tiết cấu trúc phẳng dẹt đổ thẳng vào dataSource của UI Table' })
  async getDetailForFE(@Param('id', ParseIntPipe) id: number) {
    return await this.reportService.getDetailForFE(id);
  }

  @Get('executive-summary')
  @RequirePermissions(PermissionCode.REPORT_VIEW)
  @ApiOperation({ summary: '🎯 Báo cáo tổng hợp số liệu Tai nạn lao động theo từng loại hình sở hữu doanh nghiệp (Dành cho Lãnh đạo)' })
  @ApiQuery({ name: 'year', required: true, type: Number })
  async getSummaryReport(@Query('year', ParseIntPipe) year: number) {
    return await this.reportService.getSummaryReport(year);
  }
}