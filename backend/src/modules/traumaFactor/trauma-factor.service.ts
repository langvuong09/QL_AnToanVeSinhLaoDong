import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not, IsNull, DataSource } from 'typeorm';
import Response from '../../commons/response';
import { Trauma } from './trauma-factor.entity';
import { CreateTraumaDto } from './dto/create-trauma.dto';
import { UpdateTraumaDto } from './dto/update-trauma.dto';
import { ReportDetail } from '../report/report-detail.entity';

@Injectable()
export class TraumaService {
  constructor(
    @InjectRepository(Trauma)
    private readonly traumaRepository: Repository<Trauma>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateTraumaDto) {
    const formattedCode = dto.code.trim();
    const isCodeExist = await this.traumaRepository.findOne({ where: { code: formattedCode, deletedAt: IsNull() } });
    if (isCodeExist) throw new BadRequestException(`Mã yếu tố "${formattedCode}" này đã tồn tại!`);
    return await this.traumaRepository.save(this.traumaRepository.create({ ...dto, code: formattedCode }));
  }

  async update(id: number, dto: UpdateTraumaDto) {
    const trauma = await this.traumaRepository.findOneBy({ id });
    if (!trauma) throw new NotFoundException('Không tìm thấy yếu tố gây chấn thương');

    if (dto.code && dto.code.trim() !== trauma.code) {
      const isCodeExist = await this.traumaRepository.findOne({ where: { code: dto.code.trim(), id: Not(id), deletedAt: IsNull() } });
      if (isCodeExist) throw new BadRequestException(`Mã "${dto.code}" đã được sử dụng!`);
      dto.code = dto.code.trim();
    }
    Object.assign(trauma, dto);
    return await this.traumaRepository.save(trauma);
  }

  // Admin xem tất cả
  async getAllForAdmin(query: any) { return this.getTraumasBase(query, false); }
  
  // Business chỉ xem active
  async getAllForBusiness(query: any) { return this.getTraumasBase(query, true); }

  private async getTraumasBase(query: any, onlyActive: boolean) {
    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 10;
    const { code, name, isActive } = query;

    const qb = this.traumaRepository.createQueryBuilder('t').where('t.deletedAt IS NULL');
    
    if (onlyActive) {
      qb.andWhere('t.isActive = :active', { active: true });
    } else if (isActive !== undefined && isActive !== '') {
      qb.andWhere('t.isActive = :active', { active: isActive === 'true' });
    }

    if (code) qb.andWhere('t.code ILike :code', { code: `%${code.trim()}%` });
    if (name) qb.andWhere('t.name ILike :name', { name: `%${name.trim()}%` });

    const [items, count] = await qb.orderBy('t.id', 'ASC').skip((page - 1) * pageSize).take(pageSize).getManyAndCount();
    return Response.getList({ items, count, pageSize, pageNumber: page });
  }

  async toggleActive(id: number, isActive: boolean) {
    const trauma = await this.traumaRepository.findOneBy({ id });
    if (!trauma) throw new NotFoundException('Không tìm thấy yếu tố này');
    await this.traumaRepository.update(id, { isActive });
    return Response.SUCCESSFULLY;
  }

  async getDetail(id: number) {
    const trauma = await this.traumaRepository.findOneBy({ id });
    if (!trauma) throw new NotFoundException('Không tìm thấy yếu tố này');
    return Response.get(trauma);
  }

  async bulkRemove(ids: number[]) {
    const isUsed = await this.dataSource.getRepository(ReportDetail).findOne({
      where: { traumaId: In(ids) }
    });

    if (isUsed) {
      throw new BadRequestException('Không thể xóa! Có yếu tố chấn thương đang được sử dụng trong báo cáo.');
    }
    await this.traumaRepository.softDelete(ids);
    return Response.SUCCESSFULLY;
  }
}