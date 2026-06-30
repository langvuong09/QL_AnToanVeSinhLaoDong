import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, IsNull, Repository } from 'typeorm';
import { ReportType } from './report-type.entity';
import { CreateReportTypeDto } from './dto/create-report-type.dto';
import { UpdateReportTypeDto } from './dto/update-report-type.dto';
import Response from '../../commons/response';
import { Report, ReportStatus } from '../report/report.entity';
import { Doet } from '../doet/doet.entity';

@Injectable()
export class ReportTypeService {
  constructor(
    @InjectRepository(ReportType)
    private readonly reportTypeRepository: Repository<ReportType>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateReportTypeDto, adminUser?: any) {
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);
    const now = new Date(); // Lấy thời gian hiện tại

    if (startDate > endDate) {
      throw new BadRequestException(
        'Thời gian bắt đầu không thể lớn hơn thời gian kết thúc!',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newConfig = queryRunner.manager.create(ReportType, dto);
      const savedConfig = await queryRunner.manager.save(ReportType, newConfig);

      // CHỈ SINH BÁO CÁO NẾU NGÀY BẮT ĐẦU <= NGÀY HIỆN TẠI
      if (startDate <= now) {
        const activeCompanies = await queryRunner.manager.find(Doet, {
          where: { status: true, deletedAt: IsNull() },
          select: { id: true },
        });

        if (activeCompanies.length > 0) {
          const warningThresholdDate = new Date();
          warningThresholdDate.setDate(warningThresholdDate.getDate() + 5);

          const initialStatus =
            endDate <= warningThresholdDate
              ? ReportStatus.OVERDUE_WARNING
              : ReportStatus.DRAFT;

          const autoReports = activeCompanies.map((company) =>
            queryRunner.manager.create(Report, {
              title: `Báo cáo định kỳ - ${savedConfig.name} (Tự động khởi tạo)`,
              year: savedConfig.year,
              note: '',
              status: initialStatus,
              reportTypeId: savedConfig.id,
              doetId: company.id,
              details: [],
            }),
          );

          await queryRunner.manager.insert(Report, autoReports);
        }
      }

      await queryRunner.commitTransaction();
      return Response.get(savedConfig);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, dto: UpdateReportTypeDto) {
    const config = await this.reportTypeRepository.findOneBy({ id });
    if (!config) {
      throw new NotFoundException('Không tìm thấy cấu hình báo cáo này!');
    }

    const now = new Date();

    const finalStartDate = dto.startDate
      ? new Date(dto.startDate)
      : new Date(config.startDate);
    const finalEndDate = dto.endDate
      ? new Date(dto.endDate)
      : new Date(config.endDate);

    if (dto.endDate && finalEndDate < now) {
      throw new BadRequestException(
        'Ngày kết thúc mới không thể ở trong quá khứ!',
      );
    }

    if (finalStartDate > finalEndDate) {
      throw new BadRequestException(
        'Thời gian bắt đầu không thể lớn hơn thời gian kết thúc!',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      Object.assign(config, dto);
      const savedConfig = await queryRunner.manager.save(ReportType, config);

      if (dto.endDate) {
        const warningThresholdDate = new Date();
        warningThresholdDate.setDate(warningThresholdDate.getDate() + 5);

        if (finalEndDate <= warningThresholdDate) {
          await queryRunner.manager.update(
            Report,
            {
              reportTypeId: id,
              status: In([ReportStatus.DRAFT, ReportStatus.OVERDUE]),
            },
            { status: ReportStatus.OVERDUE_WARNING },
          );
        } else {
          await queryRunner.manager.update(
            Report,
            {
              reportTypeId: id,
              status: In([ReportStatus.OVERDUE_WARNING, ReportStatus.OVERDUE]),
            },
            { status: ReportStatus.DRAFT },
          );
        }
      }

      await queryRunner.commitTransaction();
      return Response.get(savedConfig);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getDetail(id: number) {
    const config = await this.reportTypeRepository.findOneBy({ id });
    if (!config) throw new NotFoundException('Không tìm thấy cấu hình báo cáo');
    return Response.get(config);
  }

  async toggleActive(id: number, isActive: boolean) {
    const config = await this.reportTypeRepository.findOneBy({ id });
    if (!config) throw new NotFoundException('Không tìm thấy cấu hình báo cáo');

    config.isActive = isActive;
    await this.reportTypeRepository.save(config);
    return Response.SUCCESSFULLY;
  }

  async getAllForAdmin(query: any) {
    return this.getReportTypesBase(query, false);
  }

  async getAllForBusiness(query: any) {
    return this.getReportTypesBase(query, true);
  }

  private async getReportTypesBase(query: any, onlyActive: boolean) {
    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 10;
    const { year, name, period, startDate, endDate, isActive } = query;

    const queryBuilder = this.reportTypeRepository.createQueryBuilder('rt');

    if (onlyActive) {
      queryBuilder.andWhere('rt.isActive = :onlyActiveStatus', {
        onlyActiveStatus: true,
      });
    } else if (isActive !== undefined && isActive !== '') {
      const activeBool = isActive === 'true' || isActive === true;
      queryBuilder.andWhere('rt.isActive = :activeBool', { activeBool });
    }

    if (year) {
      queryBuilder.andWhere('rt.year = :year', { year: Number(year) });
    }

    if (name) {
      queryBuilder.andWhere('rt.name ILike :name', {
        name: `%${name.trim()}%`,
      });
    }

    if (period) {
      queryBuilder.andWhere('rt.period = :period', { period: period.trim() });
    }

    if (startDate && endDate) {
      queryBuilder.andWhere(
        'rt.startDate <= :endDate AND rt.endDate >= :startDate',
        {
          startDate,
          endDate,
        },
      );
    } else if (startDate) {
      queryBuilder.andWhere('rt.endDate >= :startDate', { startDate });
    } else if (endDate) {
      queryBuilder.andWhere('rt.startDate <= :endDate', { endDate });
    }

    queryBuilder.orderBy('rt.year', 'DESC').addOrderBy('rt.startDate', 'ASC');

    const [items, totalCount] = await queryBuilder
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return Response.getList({
      items,
      count: totalCount,
      pageSize,
      pageNumber: page,
    });
  }
}
