import { 
  Body, Controller, Get, Param, Post, Put, Query, ParseIntPipe, UseGuards, UseInterceptors, ClassSerializerInterceptor 
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateTraumaDto } from './dto/create-trauma.dto';
import { UpdateTraumaDto } from './dto/update-trauma.dto';
import { AuthGuard } from "../../commons/guards/authGuard";
import { PermissionGuard } from 'src/commons/guards/permissionGuard';
import { PermissionCode } from 'src/commons/enums/permission.enum';
import { RequirePermissions } from 'src/commons/guards/permission.decorator';
import { TraumaService } from './trauma-factor.service';

@ApiTags('Trauma Factors (Yếu tố gây chấn thương)')
@Controller('trauma-factors')
@UseGuards(AuthGuard, PermissionGuard)
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
export class TraumaController {
  constructor(private readonly traumaService: TraumaService) {}

  @Post()
  @RequirePermissions(PermissionCode.TRAUMA_FACTOR_CREATE)
  @ApiOperation({ summary: 'Tạo mới một yếu tố gây chấn thương' })
  @ApiBody({ type: CreateTraumaDto })
  async create(@Body() dto: CreateTraumaDto) {
    return await this.traumaService.create(dto);
  }

  @Put(':id')
  @RequirePermissions(PermissionCode.TRAUMA_FACTOR_UPDATE)
  @ApiOperation({ summary: 'Cập nhật thông tin một yếu tố gây chấn thương' })
  @ApiBody({ type: UpdateTraumaDto, description: 'Các trường dữ liệu cần cập nhật (Mã, Tên, Trạng thái)' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTraumaDto
  ) {
    return await this.traumaService.update(id, dto);
  }

  @Get()
  @RequirePermissions(PermissionCode.TRAUMA_FACTOR_VIEW)
  @ApiOperation({ summary: 'Lấy danh sách yếu tố gây chấn thương (Phân trang & Bộ lọc độc lập từng ô)' })
  @ApiQuery({ name: 'page', required: false, example: 1, description: 'Số trang hiện tại' })
  @ApiQuery({ name: 'pageSize', required: false, example: 10, description: 'Số lượng bản ghi trên một trang' })
  @ApiQuery({ name: 'code', required: false, description: 'Tìm kiếm chính xác/gần đúng theo mã yếu tố chấn thương (Ví dụ: Mã 1)' })
  @ApiQuery({ name: 'name', required: false, description: 'Tìm kiếm gần đúng theo tên yếu tố gây chấn thương (Ví dụ: Điện)' })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Lọc trạng thái hoạt động (true = Bật, false = Tắt)' })
  async getAll(
    @Query() query: { page?: number; pageSize?: number; code?: string; name?: string; isActive?: boolean }
  ) {
    return await this.traumaService.getAll(query);
  }

  @Get(':id')
  @RequirePermissions(PermissionCode.TRAUMA_FACTOR_VIEW)
  @ApiOperation({ summary: 'Lấy thông tin chi tiết một yếu tố gây chấn thương' })
  async getDetail(@Param('id', ParseIntPipe) id: number) {
    return await this.traumaService.getDetail(id);
  }

  @Post('bulk-delete')
  @RequirePermissions(PermissionCode.TRAUMA_FACTOR_DELETE)
  @ApiOperation({ summary: 'Xóa hàng loạt yếu tố gây chấn thương khỏi hệ thống' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ids: { 
          type: 'array', 
          items: { type: 'integer' }, 
          example: [1, 2, 3], 
          description: 'Mảng chứa các ID danh mục cần xóa' 
        }
      },
      required: ['ids']
    }
  })
  async bulkDelete(@Body('ids') ids: number[]) {
    return await this.traumaService.bulkRemove(ids);
  }
}