import {ClassSerializerInterceptor, Controller, Get, Param, UseGuards, UseInterceptors,} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/commons/bases';
import { AuthGuard } from 'src/commons/guards/authGuard';
import { View } from './view.entity';
import ResponseInterceptor from 'src/interceptors/response.interceptor';
import { List, ResponseData } from 'src/commons/response';
import { ViewService } from './view.service';

@ApiTags('Views')
@Controller('views')
@UseGuards(AuthGuard)
export class ViewController extends BaseController<View, ViewService> {
  constructor(private readonly viewService: ViewService) {
    super(viewService);
  }

  @Get('roles/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(ResponseInterceptor, ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Get items by role code' })
  async getViewsByRoleCode(
    @Param('code') id: string,
  ): Promise<ResponseData<List<View[]>>> {
    return await this.viewService.getViewsByRoleCode(id);
  }
}
