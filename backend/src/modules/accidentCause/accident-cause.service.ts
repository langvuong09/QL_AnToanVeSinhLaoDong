import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Not, IsNull } from "typeorm";
import Response from '../../commons/response';
import { AccidentCause } from "./accident-cause.entity";
import { CreateAccidentCauseDto } from "./dto/create-accident-cause.dto";

@Injectable()
export class AccidentCauseService {
  constructor(
    @InjectRepository(AccidentCause)
    private readonly repo: Repository<AccidentCause>,
  ) {}

  async create(dto: CreateAccidentCauseDto) {
    const code = dto.code.trim();
    const exist = await this.repo.findOne({ where: { code, deletedAt: IsNull() } });
    if (exist) throw new BadRequestException(`Mã nguyên nhân đã tồn tại!`);
    return await this.repo.save(this.repo.create({ ...dto, code }));
  }

  async update(id: number, dto: any) {
    const item = await this.repo.findOneBy({ id });
    if (!item) throw new NotFoundException('Không tìm thấy nguyên nhân này');
    
    if (dto.code && dto.code.trim() !== item.code) {
      const exist = await this.repo.findOne({ where: { code: dto.code.trim(), id: Not(id), deletedAt: IsNull() } });
      if (exist) throw new BadRequestException('Mã nguyên nhân đã được sử dụng!');
      dto.code = dto.code.trim();
    }
    Object.assign(item, dto);
    return await this.repo.save(item);
  }

  // Admin: Xem tất cả
  async getAllForAdmin(query: any) { return this.getFilteredList(query, false); }
  
  // Business: Chỉ xem Active
  async getAllForBusiness(query: any) { return this.getFilteredList(query, true); }

  private async getFilteredList(query: any, onlyActive: boolean) {
    const page = Math.max(1, Number(query.page) || 1);
    const pageSize = Math.max(1, Number(query.pageSize) || 10);
    const { code, name, type, isActive } = query;

    const qb = this.repo.createQueryBuilder('t').where('t.deletedAt IS NULL');
    
    if (onlyActive) qb.andWhere('t.isActive = :active', { active: true });
    else if (isActive !== undefined && isActive !== '') qb.andWhere('t.isActive = :active', { active: isActive === 'true' });
    
    if (type) qb.andWhere('t.type = :type', { type });
    if (code) qb.andWhere('t.code ILike :c', { c: `%${code.trim()}%` });
    if (name) qb.andWhere('t.name ILike :n', { n: `%${name.trim()}%` });

    const [items, count] = await qb
      .orderBy('t.id', 'ASC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return Response.getList({ items, count, pageSize, pageNumber: page });
  }

  async toggleActive(id: number, isActive: boolean) {
    const item = await this.repo.findOneBy({ id });
    if (!item) throw new NotFoundException('Không tìm thấy nguyên nhân');
    await this.repo.update(id, { isActive });
    return Response.SUCCESSFULLY;
  }

  async bulkRemove(ids: number[]) {
    await this.repo.softDelete(ids);
    return Response.SUCCESSFULLY;
  }

  async getDetail(id: number) {
    const item = await this.repo.findOneBy({ id });
    if (!item) throw new NotFoundException('Không tìm thấy nguyên nhân này');
    return Response.get(item);
  }
}