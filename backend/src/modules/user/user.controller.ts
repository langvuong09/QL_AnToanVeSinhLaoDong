import { 
  Body, Controller, Get, Param, Post, Put, Query, UseGuards, ParseUUIDPipe, Patch, 
  UseInterceptors,
  ClassSerializerInterceptor
} from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthGuard } from "../../commons/guards/authGuard";
import { GetUser } from "src/commons/guards/user.decorator";
import { CurrentUser } from "../auth/auth.model";
import { ChangePasswordDto } from "./dto/change-password";
import { UpdateProfileDto } from "./dto/update-profile";
import { CreateUserDto } from "./dto/create-user";
import { ApiBearerAuth, ApiOperation, ApiTags, ApiQuery, ApiBody } from '@nestjs/swagger';
import { PermissionGuard } from "src/commons/guards/permissionGuard";
import { RequirePermissions } from "src/commons/guards/permission.decorator";
import { PermissionCode } from "src/commons/enums/permission.enum";

@ApiTags("Users")
@Controller("users")
@UseGuards(AuthGuard,PermissionGuard)
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @RequirePermissions(PermissionCode.USER_VIEW)
  @ApiOperation({ summary: "Lấy danh sách người dùng với các bộ lọc độc lập" })
  @ApiQuery({ name: "page", required: false, example: 1, description: "Số trang hiện tại" })
  @ApiQuery({ name: "pageSize", required: false, example: 10, description: "Số lượng bản ghi trên một trang" })
  @ApiQuery({ name: "fullName", required: false, description: "Tìm kiếm gần đúng theo Họ và tên" })
  @ApiQuery({ name: "username", required: false, description: "Tìm kiếm gần đúng theo Tên tài khoản đăng nhập" })
  @ApiQuery({ name: "email", required: false, description: "Tìm kiếm gần đúng theo địa chỉ Email" })
  @ApiQuery({ name: "roleId", required: false, description: "Lọc đích danh theo ID Vai trò hệ thống" })
  @ApiQuery({ name: "position", required: false, description: "Tìm kiếm gần đúng theo Chức danh công việc" })
  @ApiQuery({ name: "status", required: false, type: Boolean, description: "Lọc theo Trạng thái hoạt động (true = Bật, false = Tắt)" })
  async getAll(
    @Query() query: { 
      page?: number; 
      pageSize?: number; 
      fullName?: string; 
      username?: string; 
      email?: string; 
      roleId?: number; 
      position?: string; 
      status?: boolean; 
    }
  ) {
    return await this.userService.getAll(query);
  }

  @Get(":id")
  @RequirePermissions(PermissionCode.USER_VIEW)
  @ApiOperation({ summary: "Lấy thông tin chi tiết người dùng" })
  async getDetail(@Param("id", ParseUUIDPipe) id: string) {
    return await this.userService.getDetail(id);
  }

  @Post()
  @RequirePermissions(PermissionCode.USER_CREATE)
  @ApiOperation({ summary: "Tạo mới người dùng" })
  @ApiBody({ type: CreateUserDto, description: "Dữ liệu để tạo người dùng mới" })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  @Patch(":id/status")
  @RequirePermissions(PermissionCode.USER_UPDATE)
  @ApiOperation({ summary: "Bật/Tắt trạng thái người dùng" })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { 
          type: 'boolean', 
          description: 'Trạng thái hoạt động của user (true: Bật, false: Tắt)', 
          example: true 
        }
      },
      required: ['status']
    }
  })
  async toggleStatus(
    @Param("id", ParseUUIDPipe) id: string, 
    @Body("status") status: boolean
  ) {
    return await this.userService.toggleStatus(id, status);
  }

  @Put(":id/profile")
  @RequirePermissions(PermissionCode.USER_UPDATE)
  @ApiOperation({ summary: "Cập nhật thông tin" })
  async updateProfile(
    @Param("id", ParseUUIDPipe) id: string, 
    @Body() updateDto: UpdateProfileDto
  ) {
    return await this.userService.updateProfile(id, updateDto);
  }

  @Post("reset-password")
  @RequirePermissions(PermissionCode.USER_UPDATE)
  @ApiOperation({ summary: "Đổi mật khẩu người dùng" })
  async resetPassword(
    @GetUser() currentUser: CurrentUser,
    @Body() changePasswordDto: ChangePasswordDto
  ) {
    return await this.userService.resetPassword(currentUser.id, changePasswordDto);
  }

  @Post(":id/set-password")
  @RequirePermissions(PermissionCode.USER_UPDATE)
  @ApiOperation({ summary: "Đặt lại mật khẩu cho người dùng (Admin)" })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        newPassword: { 
          type: 'string', 
          example: 'AdminReset@123', 
          description: 'Mật khẩu mới do Admin chỉ định' 
        }
      },
      required: ['newPassword']
    }
  })
  async setPassword(
    @Param("id", ParseUUIDPipe) id: string,
    @Body("newPassword") newPassword: string
  ) {
    return await this.userService.setPassword(id, newPassword);
  }

  @Post('bulk-delete')
  @RequirePermissions(PermissionCode.USER_DELETE)
  @ApiOperation({ summary: 'Xóa mềm hàng loạt tài khoản người dùng khỏi hệ thống' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        ids: { type: 'array', items: { type: 'string' }, example: ["uuid-1", "uuid-2"], description: 'Mảng các UUID người dùng cần xóa' }
      },
      required: ['ids']
    }
  })
  async bulkDelete(@Body('ids') ids: string[]) {
    return await this.userService.bulkRemove(ids);
  }
}