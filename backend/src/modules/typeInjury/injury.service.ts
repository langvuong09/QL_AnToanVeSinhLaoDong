import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In, IsNull } from 'typeorm';
import { CreateInjuryTypeDto } from './dto/create-injury-type.dto';
import { UpdateInjuryTypeDto } from './dto/update-injury-type.dto';
import Response from '../../commons/response';
import { InjuryType } from './injury.entity';

@Injectable()
export class InjuryTypeService {
  constructor(
    @InjectRepository(InjuryType)
    private readonly injuryRepository: Repository<InjuryType>,
  ) {}

  /**
   * 🎯 Tạo mới loại chấn thương
   */
  async create(dto: CreateInjuryTypeDto) {
    const formattedCode = dto.code.trim();

    const isCodeExist = await this.injuryRepository.findOne({
      where: { code: formattedCode }
    });
    if (isCodeExist) {
      throw new BadRequestException('Mã loại chấn thương này đã tồn tại!');
    }

    if (dto.parentId) {
      const parentExist = await this.injuryRepository.findOne({
        where: { id: dto.parentId, deletedAt: IsNull() }
      });
      
      if (!parentExist) {
        throw new NotFoundException('Không tìm thấy loại chấn thương cha đã chọn hoặc danh mục đã bị xóa!');
      }

      if (!parentExist.isActive) {
        throw new BadRequestException('Không thể chọn loại chấn thương cha đang bị ngưng hoạt động!');
      }
    }

    const newInjury = this.injuryRepository.create({
      ...dto,
      code: formattedCode
    });
    return await this.injuryRepository.save(newInjury);
  }

  async update(id: number, dto: UpdateInjuryTypeDto) {
    const injury = await this.injuryRepository.findOneBy({ id });
    if (!injury || injury.deletedAt) {
      throw new NotFoundException('Không tìm thấy loại chấn thương này');
    }

    if (dto.code && dto.code.trim() !== injury.code) {
      const formattedCode = dto.code.trim();
      const isCodeExist = await this.injuryRepository.findOne({
        where: { code: formattedCode, id: Not(id) }
      });
      if (isCodeExist) throw new BadRequestException('Mã loại chấn thương mới đã được sử dụng!');
      dto.code = formattedCode;
    }

    if (dto.parentId) {
      if (dto.parentId === id) {
        throw new BadRequestException('Không thể chọn chính danh mục này làm danh mục cha!');
      }
      
      const parentExist = await this.injuryRepository.findOne({
        where: { id: dto.parentId, deletedAt: IsNull() }
      });
      if (!parentExist) {
        throw new NotFoundException('Không tìm thấy loại chấn thương cha đã chọn hoặc danh mục đã bị xóa!');
      }
      if (!parentExist.isActive) {
        throw new BadRequestException('Không thể chọn loại chấn thương cha đang bị ngưng hoạt động!');
      }

      const allInjuries = await this.injuryRepository.find({ 
        where: { deletedAt: IsNull() } 
      });
      
      const checkIsChildRecursive = (currentId: number, targetParentId: number): boolean => {
        const directChildren = allInjuries.filter(item => item.parentId === currentId);
        for (const child of directChildren) {
          if (child.id === targetParentId) return true;
          if (checkIsChildRecursive(child.id, targetParentId)) return true;
        }
        return false;
      };

      if (checkIsChildRecursive(id, dto.parentId)) {
        throw new BadRequestException('Không thể chọn một loại chấn thương con hoặc cháu làm danh mục cha của nó!');
      }
    }

    Object.assign(injury, dto);
    return await this.injuryRepository.save(injury);
  }

  async getAllForAdmin(query: { page?: number; pageSize?: number; code?: string; name?: string; level?: number }) {
    return this.getInjuryTypesBase(query, false);
  }

  async getAllForUser(query: { page?: number; pageSize?: number; code?: string; name?: string; level?: number }) {
    return this.getInjuryTypesBase(query, true);
  }

  private async getInjuryTypesBase(query: any, onlyActive: boolean) {
    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 10;
    const { code, name, level } = query;

    const queryBuilder = this.injuryRepository.createQueryBuilder('it')
      .leftJoinAndSelect('it.parent', 'parent')
      .leftJoinAndSelect('parent.parent', 'grandparent')
      .where('it.deletedAt IS NULL');

    if (onlyActive) {
      queryBuilder.andWhere('it.isActive = :isActive', { isActive: true });
    }

    if (code) {
      queryBuilder.andWhere('it.code ILike :code', { code: `%${code.trim()}%` });
    }

    if (name) {
      queryBuilder.andWhere('it.name ILike :name', { name: `%${name.trim()}%` });
    }

    queryBuilder.orderBy('it.code', 'ASC');
    const isFiltering = !!(code || name || level);

    if (isFiltering) {
      const allRawItems = await queryBuilder.getMany();
      const formattedItems = allRawItems.map(item => this.mapLevelAndFormat(item));

      let filteredItems = formattedItems;
      if (level) {
        filteredItems = formattedItems.filter(item => item.level === Number(level));
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

  private mapLevelAndFormat(item: InjuryType) {
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
    const injury = await this.injuryRepository.createQueryBuilder('it')
      .leftJoinAndSelect('it.parent', 'parent')
      .where('it.id = :id', { id })
      .andWhere('it.deletedAt IS NULL')
      .getOne();

    if (!injury) throw new NotFoundException('Không tìm thấy loại chấn thương này hoặc đã bị xóa');
    return Response.get(injury);
  }

  async toggleActive(id: number, isActive: boolean) {
    const injury = await this.injuryRepository.findOneBy({ id });
    if (!injury || injury.deletedAt) throw new NotFoundException('Không tìm thấy bản ghi');

    injury.isActive = isActive;
    await this.injuryRepository.save(injury);
    return Response.SUCCESSFULLY;
  }

  async bulkRemove(ids: number[]) {
    if (!ids || ids.length === 0) {
      throw new BadRequestException('Danh sách ID không được để trống');
    }

    const existing = await this.injuryRepository.findBy({ 
      id: In(ids), 
      deletedAt: IsNull() 
    });
    if (existing.length === 0) {
      throw new NotFoundException('Không tìm thấy bản ghi nào hợp lệ để xóa');
    }

    const allInjuries = await this.injuryRepository.find({ 
      where: { deletedAt: IsNull() } 
    });
    const finalIdsToDelete = new Set<number>(ids);

    const collectChildrenIdsRecursive = (parentIds: number[]) => {
      const children = allInjuries.filter(item => item.parentId && parentIds.includes(item.parentId));
      if (children.length > 0) {
        const childrenIds = children.map(c => c.id);
        childrenIds.forEach(id => finalIdsToDelete.add(id));
        collectChildrenIdsRecursive(childrenIds);
      }
    };

    collectChildrenIdsRecursive(ids);
    await this.injuryRepository.softDelete(Array.from(finalIdsToDelete));
    return Response.SUCCESSFULLY;
  }
}