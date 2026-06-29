import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In, IsNull, DataSource } from 'typeorm';
import Response from '../../commons/response';
import { Job } from './job.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ReportDetail } from '../report/report-detail.entity';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateJobDto) {
      const formattedCode = dto.code.trim();
  
      const isCodeExist = await this.jobRepository.findOne({
        where: { code: formattedCode }
      });
      if (isCodeExist) {
        throw new BadRequestException('Mã ngành nghề này đã tồn tại!');
      }
  
      if (dto.parentId) {
        const parentExist = await this.jobRepository.findOne({
          where: { id: dto.parentId, deletedAt: IsNull() }
        });
        
        if (!parentExist) {
          throw new NotFoundException('Không tìm thấy nghề nghiệp cha đã chọn hoặc danh mục đã bị xóa!');
        }
  
        if (!parentExist.isActive) {
          throw new BadRequestException('Không thể chọn nghề nghiệp cha đang bị ngưng hoạt động!');
        }
      }
  
      const newJob = this.jobRepository.create({
        ...dto,
        code: formattedCode
      });
      return await this.jobRepository.save(newJob);
    }

  async update(id: number, dto: UpdateJobDto) {
    const job = await this.jobRepository.findOneBy({ id });
    if (!job || job.deletedAt) throw new NotFoundException('Không tìm thấy nghề nghiệp này');

    if (dto.code && dto.code.trim() !== job.code) {
      const isCodeExist = await this.jobRepository.findOne({ where: { code: dto.code.trim(), id: Not(id) } });
      if (isCodeExist) throw new BadRequestException('Mã nghề nghiệp mới đã được sử dụng!');
      dto.code = dto.code.trim();
    }

    if (dto.parentId) {
      if (dto.parentId === id) throw new BadRequestException('Không thể chọn chính nó làm cha!');
      const parentExist = await this.jobRepository.findOne({ where: { id: dto.parentId, deletedAt: IsNull() } });
      if (!parentExist) throw new NotFoundException('Không tìm thấy nghề nghiệp cha!');
      
      const allJobs = await this.jobRepository.find({ where: { deletedAt: IsNull() } });
      const checkRecursive = (cId: number, tId: number): boolean => {
        const children = allJobs.filter(i => i.parentId === cId);
        return children.some(c => c.id === tId || checkRecursive(c.id, tId));
      };
      if (checkRecursive(id, dto.parentId)) throw new BadRequestException('Không thể chọn một nghề nghiệp con làm cha của chính nó!');
    }

    Object.assign(job, dto);
    return await this.jobRepository.save(job);
  }

  async getAllForAdmin(query: any) { return this.getJobsBase(query, false); }
  async getAllForBusiness(query: any) { return this.getJobsBase(query, true); }

  private async getJobsBase(query: any, onlyActive: boolean) {
    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 10;
    
    const { code, name, level, isActive } = query;

    const qb = this.jobRepository.createQueryBuilder('job')
      .leftJoinAndSelect('job.parent', 'parent')
      .leftJoinAndSelect('parent.parent', 'gp')
      .where('job.deletedAt IS NULL');

    if (onlyActive) {
      qb.andWhere('job.isActive = :isActive', { isActive: true });
    } else if (isActive !== undefined && isActive !== '') {
      const isAct = String(isActive) === 'true' || isActive === '1';
      qb.andWhere('job.isActive = :isActiveFilter', { isActiveFilter: isAct });
    }

    if (code) qb.andWhere('job.code ILike :code', { code: `%${code.trim()}%` });
    if (name) qb.andWhere('job.name ILike :name', { name: `%${name.trim()}%` });

    const allRawItems = await qb.orderBy('job.code', 'ASC').getMany();
    const formattedItems = allRawItems.map(item => this.mapLevelAndFormat(item));
    
    let result: any[];
    if (level) {
      result = formattedItems.filter(i => i.level === Number(level));
    } else {
      const itemIds = new Set(formattedItems.map(i => i.id));
      
      const roots = formattedItems.filter(i => !i.parentId || !itemIds.has(i.parentId));
      
      const buildTreeSafe = (nodes: any[]): any[] => {
        return nodes.map(node => {
          const children = formattedItems.filter(i => i.parentId === node.id);
          return {
            ...node,
            children: children.length > 0 ? buildTreeSafe(children) : undefined
          };
        });
      };

      result = buildTreeSafe(roots);
    }
    
    return Response.getList({
      items: result.slice((page - 1) * pageSize, page * pageSize),
      count: result.length,
      pageSize,
      pageNumber: page
    });
  }

  private mapLevelAndFormat(item: Job) {
    let calculatedLevel = 1;
    if (item.parentId) {
      calculatedLevel = 2;
      if (item.parent?.parentId) {
        calculatedLevel = 3;
        if (item.parent?.parent?.parentId) calculatedLevel = 4;
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
    const job = await this.jobRepository.createQueryBuilder('job')
      .leftJoinAndSelect('job.parent', 'parent')
      .where('job.id = :id', { id })
      .andWhere('job.deletedAt IS NULL')
      .getOne();
      
    if (!job) throw new NotFoundException('Không tìm thấy!');
    return Response.get(job);
  }

  async toggleActive(id: number, isActive: boolean) {
    await this.jobRepository.update(id, { isActive });
    return Response.SUCCESSFULLY;
  }

  async bulkRemove(ids: number[]) {
    if (!ids || ids.length === 0) throw new BadRequestException('Danh sách ID trống');
    const all = await this.jobRepository.find({ where: { deletedAt: IsNull() } });
    const finalIds = new Set<number>(ids);

    const collectChildren = (pids: number[]) => {
      all.filter(i => i.parentId && pids.includes(i.parentId)).forEach(c => {
        finalIds.add(c.id);
        collectChildren([c.id]);
      });
    };
    collectChildren(ids);

    const finalIdsArray = Array.from(finalIds);

    const isUsed = await this.dataSource.getRepository(ReportDetail).findOne({
      where: { jobId: In(finalIdsArray) }
    });

    if (isUsed) {
      throw new BadRequestException('Không thể xóa! Có nghề nghiệp (hoặc nghề nghiệp con) đang được sử dụng trong báo cáo.');
    }

    await this.jobRepository.softDelete(finalIdsArray);
    return Response.SUCCESSFULLY;
  }
}