import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In, IsNull, DataSource } from 'typeorm'; // Thêm IsNull ở đây

import Response from '../../commons/response';
import { Industry } from '../industry/industry.entity';
import { CreateIndustryDto } from '../industry/dto/create-industry.dto';
import { UpdateIndustryDto } from '../industry/dto/update-industry.dto';
import { Doet } from '../doet/doet.entity';

@Injectable()
export class IndustryService {
  constructor(
    @InjectRepository(Industry)
    private readonly industryRepository: Repository<Industry>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateIndustryDto) {
    const formattedCode = dto.code.trim();

    const isCodeExist = await this.industryRepository.findOne({
      where: { code: formattedCode }
    });
    if (isCodeExist) {
      throw new BadRequestException('Mã ngành nghề này đã tồn tại!');
    }

    if (dto.parentId) {
      const parentExist = await this.industryRepository.findOne({
        where: { id: dto.parentId, deletedAt: IsNull() }
      });
      
      if (!parentExist) {
        throw new NotFoundException('Không tìm thấy ngành nghề cha đã chọn hoặc danh mục đã bị xóa!');
      }

      if (!parentExist.isActive) {
        throw new BadRequestException('Không thể chọn ngành nghề cha đang bị ngưng hoạt động!');
      }
    }

    const newIndustry = this.industryRepository.create({
      ...dto,
      code: formattedCode
    });
    return await this.industryRepository.save(newIndustry);
  }

  async update(id: number, dto: UpdateIndustryDto) {
    const industry = await this.industryRepository.findOneBy({ id });
    if (!industry || industry.deletedAt) {
      throw new NotFoundException('Không tìm thấy ngành nghề này');
    }

    if (dto.code && dto.code.trim() !== industry.code) {
      const formattedCode = dto.code.trim();
      const isCodeExist = await this.industryRepository.findOne({
        where: { code: formattedCode, id: Not(id) }
      });
      if (isCodeExist) throw new BadRequestException('Mã ngành nghề mới đã được sử dụng!');
      dto.code = formattedCode;
    }

    if (dto.parentId) {
      if (dto.parentId === id) {
        throw new BadRequestException('Không thể chọn chính danh mục này làm ngành nghề cha!');
      }

      const parentExist = await this.industryRepository.findOne({
        where: { id: dto.parentId, deletedAt: IsNull() }
      });
      if (!parentExist) {
        throw new NotFoundException('Không tìm thấy ngành nghề cha đã chọn hoặc danh mục đã bị xóa!');
      }
      if (!parentExist.isActive) {
        throw new BadRequestException('Không thể chọn ngành nghề cha đang bị ngưng hoạt động!');
      }

      const allIndustries = await this.industryRepository.find({ 
        where: { deletedAt: IsNull() } 
      });
      
      const checkIsChildRecursive = (currentId: number, targetParentId: number): boolean => {
        const directChildren = allIndustries.filter(item => item.parentId === currentId);
        for (const child of directChildren) {
          if (child.id === targetParentId) return true;
          if (checkIsChildRecursive(child.id, targetParentId)) return true;
        }
        return false;
      };

      if (checkIsChildRecursive(id, dto.parentId)) {
        throw new BadRequestException('Không thể chọn một ngành nghề con hoặc cháu làm ngành nghề cha của nó!');
      }
    }

    Object.assign(industry, dto);
    return await this.industryRepository.save(industry);
  }

  async getAllForAdmin(query: { page?: number; pageSize?: number; code?: string; name?: string; level?: number ; isActive?: boolean }) {
    return this.getIndustriesBase(query, false);
  }

  async getAllForBusiness(query: { page?: number; pageSize?: number; code?: string; name?: string; level?: number }) {
    return this.getIndustriesBase(query, true);
  }

  private async getIndustriesBase(query: any, onlyActive: boolean) {
    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 10;
    const { code, name, level , isActive} = query;

    const queryBuilder = this.industryRepository.createQueryBuilder('industry')
      .leftJoinAndSelect('industry.parent', 'parent')
      .leftJoinAndSelect('parent.parent', 'grandparent')
      .where('industry.deletedAt IS NULL');

    if (onlyActive) {
      queryBuilder.andWhere('industry.isActive = :isActive', { isActive: true });
    } 
    else if (isActive !== undefined) {
      const activeBool = String(isActive) === 'true';
      queryBuilder.andWhere('industry.isActive = :isActive', { isActive: activeBool });
    }

    if (code) {
      queryBuilder.andWhere('industry.code ILike :code', { code: `%${code.trim()}%` });
    }

    if (name) {
      queryBuilder.andWhere('industry.name ILike :name', { name: `%${name.trim()}%` });
    }

    queryBuilder.orderBy('industry.code', 'ASC');
    const isFiltering = !!(code || name || level);

    if (isFiltering) {
      const allRawItems = await queryBuilder.getMany();
      const formattedItems = allRawItems.map(item => this.mapLevelAndFormat(item));

      let filteredItems = formattedItems;
      if (level) {
        const targetLevel = Number(level);
        filteredItems = formattedItems.filter(item => item.level === targetLevel);
      }

      const totalCount = filteredItems.length;
      const paginatedItems = filteredItems.slice((page - 1) * pageSize, page * pageSize);

      return Response.getList({
        items: paginatedItems,
        count: totalCount,
        pageSize,
        pageNumber: page
      });
    } else {
      const allRawItems = await queryBuilder.getMany();
      const formattedItems = allRawItems.map(item => this.mapLevelAndFormat(item));
      const treeData = this.buildTree(formattedItems, null);

      const totalCount = treeData.length;
      const paginatedTree = treeData.slice((page - 1) * pageSize, page * pageSize);

      return Response.getList({
        items: paginatedTree,
        count: totalCount,
        pageSize,
        pageNumber: page
      });
    }
  }

  private mapLevelAndFormat(item: Industry) {
    let calculatedLevel = 1;

    if (item.parentId) {
      calculatedLevel = 2;
      if (item.parent?.parentId) {
        calculatedLevel = 3; 
        if (item.parent?.parent?.parentId) {
          calculatedLevel = 4; 
        }
      }
    }

    return {
      id: item.id,
      code: item.code,
      name: item.name,
      isActive: item.isActive,
      parentId: item.parentId,
      level: calculatedLevel,            
      levelText: `Cấp ${calculatedLevel}`  
    };
  }

  private buildTree(list: any[], parentId: number | null = null): any[] {
    const tree: any[] = [];
    for (const item of list) {
      if (item.parentId === parentId || (!item.parentId && !parentId)) {
        const children = this.buildTree(list, item.id);
        tree.push({
          ...item,
          children: children.length > 0 ? children : undefined
        });
      }
    }
    return tree;
  }

  async getDetail(id: number) {
    const industry = await this.industryRepository.createQueryBuilder('industry')
      .leftJoinAndSelect('industry.parent', 'parent')
      .where('industry.id = :id', { id })
      .andWhere('industry.deletedAt IS NULL')
      .getOne();

    if (!industry) throw new NotFoundException('Không tìm thấy ngành nghề này hoặc đã bị xóa');
    return Response.get(industry);
  }

  async toggleActive(id: number, isActive: boolean) {
    const industry = await this.industryRepository.findOneBy({ id });
    if (!industry || industry.deletedAt) throw new NotFoundException('Không tìm thấy ngành nghề này');

    industry.isActive = isActive;
    await this.industryRepository.save(industry);
    return Response.SUCCESSFULLY;
  }

  async bulkRemove(ids: number[]) {
    if (!ids || ids.length === 0) {
      throw new BadRequestException('Danh sách ID cần xóa không được để trống');
    }

    const existing = await this.industryRepository.findBy({ 
      id: In(ids), 
      deletedAt: IsNull() 
    });

    if (existing.length === 0) {
      throw new NotFoundException('Không tìm thấy ngành nghề nào hợp lệ để tiến hành xóa');
    }

    const allIndustries = await this.industryRepository.find({ 
      where: { deletedAt: IsNull() } 
    });
    
    const finalIdsToDelete = new Set<number>(ids);

    const collectChildrenIdsRecursive = (parentIds: number[]) => {
      const children = allIndustries.filter(item => item.parentId && parentIds.includes(item.parentId));
      if (children.length > 0) {
        const childrenIds = children.map(c => c.id);
        childrenIds.forEach(id => finalIdsToDelete.add(id));
        collectChildrenIdsRecursive(childrenIds);
      }
    };

    collectChildrenIdsRecursive(ids);
    const idsToDeleteArray = Array.from(finalIdsToDelete);

    const isUsedByDoet = await this.dataSource.getRepository(Doet).findOne({
      where: { industryId: In(idsToDeleteArray) },
    });

    if (isUsedByDoet) {
      throw new BadRequestException(
        'Không thể xóa! Có ngành nghề (hoặc ngành nghề con) đang được liên kết với dữ liệu doanh nghiệp.',
      );
    }

    await this.industryRepository.softDelete(idsToDeleteArray);
    return Response.SUCCESSFULLY;
  }
}