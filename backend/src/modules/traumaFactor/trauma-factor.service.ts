import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not } from 'typeorm';
import Response from '../../commons/response';
import { Trauma } from './trauma-factor.entity';
import { CreateTraumaDto } from './dto/create-trauma.dto';
import { UpdateTraumaDto } from './dto/update-trauma.dto';

@Injectable()
export class TraumaService {
  constructor(
    @InjectRepository(Trauma)
    private readonly traumaRepository: Repository<Trauma>,
  ) {}

  async create(dto: CreateTraumaDto) {
    const formattedCode = dto.code.trim();
    const isCodeExist = await this.traumaRepository.findOne({
      where: { code: formattedCode }
    });

    if (isCodeExist) {
      throw new BadRequestException(`Mã yếu tố "${formattedCode}" này đã tồn tại trong hệ thống!`);
    }

    const newTrauma = this.traumaRepository.create({
      ...dto,
      code: formattedCode
    });
    return await this.traumaRepository.save(newTrauma);
  }

  async update(id: number, dto: UpdateTraumaDto) {
    const trauma = await this.traumaRepository.findOneBy({ id });
    if (!trauma) {
      throw new NotFoundException('Không tìm thấy yếu tố gây chấn thương cần cập nhật');
    }

    if (dto.code && dto.code.trim() !== trauma.code) {
      const formattedCode = dto.code.trim();
      const isCodeExist = await this.traumaRepository.findOne({
        where: {
          code: formattedCode,
          id: Not(id) 
        }
      });

      if (isCodeExist) {
        throw new BadRequestException(`Mã yếu tố "${formattedCode}" mới đã được sử dụng bởi một danh mục khác!`);
      }
      dto.code = formattedCode;
    }

    Object.assign(trauma, dto);
    return await this.traumaRepository.save(trauma);
  }


  async getAll(query: { page?: number; pageSize?: number; code?: string; name?: string; isActive?: any }) {
    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 10;
    const { code, name, isActive } = query;

    const queryBuilder = this.traumaRepository.createQueryBuilder('t');

    if (code) {
      queryBuilder.andWhere('t.code ILike :code', { code: `%${code.trim()}%` });
    }
    if (name) {
      queryBuilder.andWhere('t.name ILike :name', { name: `%${name.trim()}%` });
    }
    if (isActive !== undefined && isActive !== null && isActive !== '') {
      const isActiveBool = isActive === 'true' || isActive === true;
      queryBuilder.andWhere('t.isActive = :isActiveBool', { isActiveBool });
    }

    const [items, count] = await queryBuilder
      .orderBy('t.id', 'ASC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return Response.getList({ items, count, pageSize, pageNumber: page });
  }

  async getDetail(id: number) {
    const trauma = await this.traumaRepository.findOneBy({ id });
    if (!trauma) {
      throw new NotFoundException('Không tìm thấy yếu tố gây chấn thương này hoặc đã bị xóa');
    }
    return Response.get(trauma);
  }

  async bulkRemove(ids: number[]) {
    if (!ids || ids.length === 0) {
      throw new BadRequestException('Danh sách ID cần xóa không được để trống');
    }
    const existingTraumas = await this.traumaRepository.findBy({ id: In(ids) });
    if (existingTraumas.length === 0) {
      throw new NotFoundException('Không tìm thấy yếu tố chấn thương nào hợp lệ để xóa');
    }
    await this.traumaRepository.softDelete(ids);
    return Response.SUCCESSFULLY;
  }
}