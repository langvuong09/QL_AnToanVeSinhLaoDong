import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Response, { ResponseData, List } from 'src/commons/response';
import { EntityManager, DataSource, Repository } from 'typeorm';
import { View } from './view.entity';

@Injectable()
export class ViewService{
  manager: EntityManager;
  constructor(
    @InjectRepository(View)
    private readonly viewRepository: Repository<View>,
    private readonly dataSource: DataSource,
  ) {
    this.manager = this.dataSource.manager;
  }

  async getViewsByRoleId(roleId: number): Promise<ResponseData<List<View[]>>> {
    try {
      const data = await this.manager.query(`
        select * from views v, jsonb_array_elements(v.activities) a
        where a->>'roleId' = ${roleId}::text and "deletedAt" is null
      `);
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
