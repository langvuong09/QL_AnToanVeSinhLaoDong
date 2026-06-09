import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Response, { ResponseData, List } from 'src/commons/response';
import { EntityManager, DataSource, Repository } from 'typeorm';
import { View } from './view.entity';
import { BaseService } from 'src/commons/bases/baseService';

@Injectable()
export class ViewService extends BaseService<View> {
  manager: EntityManager;
  constructor(
    @InjectRepository(View)
    private readonly viewRepository: Repository<View>,
    private readonly dataSource: DataSource,
  ) {
    super(viewRepository , View);
    this.manager = this.dataSource.manager;
  }

  async getViewsByRoleId(roleId: number): Promise<ResponseData<List<View[]>>> {
    try {
      const data = await this.manager.query(
        `
  select * from views v, jsonb_array_elements(v.activities) a
  where a->>'roleId' = $1::text
`,
        [roleId],
      );
      const items = data.map((x) => {
        const activities = x.activities.filter((y) => y.roleId === roleId);
        return {
          ...x,
          activities,
        };
      });
      const list: List<View[]> = {
        items,
        count: items.length,
      };
      return Response.getList<View>(list);
    } catch (error) {
      throw Response.errorInternal(error);
    }
  }
}
