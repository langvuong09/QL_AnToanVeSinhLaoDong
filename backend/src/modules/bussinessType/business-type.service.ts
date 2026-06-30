import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In, DataSource } from 'typeorm';
import { BusinessType } from './business-type.entity';
import Response from '../../commons/response';
import { Doet } from '../doet/doet.entity';

@Injectable()
export class BusinessTypeService {
  constructor(
    @InjectRepository(BusinessType)
    private readonly businessTypeRepository: Repository<BusinessType>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: { code: string; name: string; isActive?: boolean }) {
    const isCodeExist = await this.businessTypeRepository.findOne({
      where: { code: dto.code.trim() },
    });

    if (isCodeExist) {
      throw new BadRequestException(
        'Mã loại hình doanh nghiệp này đã tồn tại!',
      );
    }

    const newType = this.businessTypeRepository.create({
      ...dto,
      code: dto.code.trim(),
    });

    return await this.businessTypeRepository.save(newType);
  }

  async getAllForAdmin(query: {
    page?: number;
    pageSize?: number;
    code?: string;
    name?: string;
    isActive?: boolean;
  }) {
    return this.getBusinessTypesBase(query, false);
  }

  async getAllForBusiness(query: {
    page?: number;
    pageSize?: number;
    code?: string;
    name?: string;
  }) {
    return this.getBusinessTypesBase({ ...query, isActive: true }, true);
  }

  private async getBusinessTypesBase(
    query: {
      page?: number;
      pageSize?: number;
      code?: string;
      name?: string;
      isActive?: any;
    },
    onlyActive: boolean,
  ) {
    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 10;
    const { code, name, isActive } = query;

    const queryBuilder = this.businessTypeRepository
      .createQueryBuilder('bt')
      .where('bt.deletedAt IS NULL');

    if (onlyActive) {
      queryBuilder.andWhere('bt.isActive = :onlyActiveStatus', {
        onlyActiveStatus: true,
      });
    } else if (isActive !== undefined && isActive !== null && isActive !== '') {
      const isActiveBool = isActive === 'true' || isActive === true;
      queryBuilder.andWhere('bt.isActive = :isActiveBool', { isActiveBool });
    }
    if (code) {
      queryBuilder.andWhere('bt.code ILike :code', {
        code: `%${code.trim()}%`,
      });
    }

    if (name) {
      queryBuilder.andWhere('bt.name ILike :name', {
        name: `%${name.trim()}%`,
      });
    }

    const [items, count] = await queryBuilder
      .orderBy('bt.code', 'ASC')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return Response.getList({
      items,
      count,
      pageSize,
      pageNumber: page,
    });
  }

  async getDetail(id: number) {
    const businessType = await this.businessTypeRepository
      .createQueryBuilder('bt')
      .where('bt.id = :id', { id })
      .andWhere('bt.deletedAt IS NULL')
      .getOne();

    if (!businessType) {
      throw new NotFoundException(
        'Không tìm thấy loại hình doanh nghiệp này hoặc đã bị xóa',
      );
    }
    return Response.get(businessType);
  }

  async update(id: number, dto: { code?: string; name?: string }) {
    const businessType = await this.businessTypeRepository.findOneBy({ id });
    if (!businessType || businessType.deletedAt) {
      throw new NotFoundException('Không tìm thấy loại hình doanh nghiệp này');
    }

    if (dto.code && dto.code.trim() !== businessType.code) {
      const isCodeExist = await this.businessTypeRepository.findOne({
        where: {
          code: dto.code.trim(),
          id: Not(id),
        },
      });

      if (isCodeExist) {
        throw new BadRequestException(
          'Mã loại hình doanh nghiệp mới đã được sử dụng bởi danh mục khác!',
        );
      }
      dto.code = dto.code.trim();
    }

    Object.assign(businessType, dto);
    return await this.businessTypeRepository.save(businessType);
  }

  async toggleActive(id: number, isActive: boolean) {
    const businessType = await this.businessTypeRepository.findOneBy({ id });
    if (!businessType || businessType.deletedAt) {
      throw new NotFoundException('Không tìm thấy loại hình doanh nghiệp này');
    }

    businessType.isActive = isActive;
    await this.businessTypeRepository.save(businessType);
    return Response.SUCCESSFULLY;
  }

  async bulkRemove(ids: number[]) {
    if (!ids || ids.length === 0) {
      throw new BadRequestException('Danh sách ID cần xóa không được để trống');
    }
    const isUsed = await this.dataSource.getRepository(Doet).findOne({
      where: { businessTypeId: In(ids) },
    });

    if (isUsed) {
      throw new BadRequestException(
        'Không thể xóa! Có doanh nghiệp đang được sử dụng.',
      );
    }

    const types = await this.businessTypeRepository.findBy({ id: In(ids) });
    if (types.length === 0) {
      throw new NotFoundException('Không tìm thấy danh mục loại hình cần xóa');
    }

    await this.businessTypeRepository.softDelete(ids);
    return Response.SUCCESSFULLY;
  }
}
