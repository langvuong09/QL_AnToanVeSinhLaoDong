import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { FileEntity } from '../media/media.entity';
import Response from '../../commons/response';
import { CreateReportDto } from './dto/create-report.dto';
import { Report, ReportStatus } from './report.entity';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ReportDetail } from './report-detail.entity';
import { UpdateReportDto } from './dto/update-report.dto';
import { StatusHistory } from '../reportHistory/report-history.entity';
import { Doet } from '../doet/doet.entity';
import { BulkUpdateStatusDto } from './dto/bulk-update-status.dto';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
    private readonly dataSource: DataSource,
  ) {}

  private calculateSum(
    ...args: (number | undefined | null)[]
  ): number | undefined {
    const sum = args.reduce<number>((acc, val) => acc + (Number(val) || 0), 0);
    return sum > 0 ? sum : undefined;
  }

  private async findOneById(id: number) {
    return this.reportRepository.findOne({
      where: { id },
      relations: {
        reportType: true,
        files: true,
        doet: { businessType: true, industry: true },
        details: { trauma: true, job: true, cause: true },
        statusHistories: { user: true },
      },
    });
  }

  async createReport(dto: CreateReportDto, user: any) {
    if (!user.doetId)
      throw new BadRequestException('Tài khoản không thuộc doanh nghiệp nào!');

    let savedReportId: number;

    await this.dataSource.transaction(async (manager) => {
      const { details, fileIds, ...reportBase } = dto;

      const basePayload: any = reportBase;

      const reportData = manager.create(Report, {
        ...basePayload,
        doetId: user.doetId,
        status: ReportStatus.DRAFT,
        m1TotalCost: this.calculateSum(
          basePayload.m1MedicalCost,
          basePayload.m1SalaryCompensation,
          basePayload.m1PropertyDamage,
        ),
        m2TotalCost: this.calculateSum(
          basePayload.m2MedicalCost,
          basePayload.m2SalaryCompensation,
          basePayload.m2PropertyDamage,
        ),
      });

      if (fileIds?.length) {
        reportData.files = await manager.findBy(FileEntity, {
          id: In(fileIds),
        });
      }

      const savedReport = await manager.save(Report, reportData);
      savedReportId = savedReport.id;

      if (details?.length) {
        const detailsToSave = details.map((d) =>
          manager.create(ReportDetail, {
            ...d,
            report: savedReport,
            totalCost: this.calculateSum(
              d.medicalCost,
              d.salaryCompensation,
              d.propertyDamage,
            ),
          }),
        );
        await manager.save(ReportDetail, detailsToSave);
      }
    });

    return Response.get(await this.findOneById(savedReportId!));
  }

  async updateReport(id: number, dto: UpdateReportDto, user: any) {
    const report = await this.reportRepository.findOne({
      where: { id },
      relations: { details: true },
    });

    if (!report) throw new NotFoundException('Không tìm thấy báo cáo!');
    if (user.doetId && report.doetId !== user.doetId)
      throw new BadRequestException('Không có quyền chỉnh sửa!');
    if (
      ![
        ReportStatus.DRAFT,
        ReportStatus.OVERDUE_WARNING,
        ReportStatus.REJECTED,
      ].includes(report.status)
    ) {
      throw new BadRequestException(
        'Trạng thái báo cáo hiện tại không cho phép chỉnh sửa!',
      );
    }

    await this.dataSource.transaction(async (manager) => {
      const { details, fileIds, ...rest } = dto;

      Object.assign(report, rest);
      report.m1TotalCost = this.calculateSum(
        report.m1MedicalCost,
        report.m1SalaryCompensation,
        report.m1PropertyDamage,
      );
      report.m2TotalCost = this.calculateSum(
        report.m2MedicalCost,
        report.m2SalaryCompensation,
        report.m2PropertyDamage,
      );

      if (fileIds !== undefined) {
        report.files =
          fileIds.length > 0
            ? await manager.findBy(FileEntity, { id: In(fileIds) })
            : [];
      }

      if (details) {
        await manager.delete(ReportDetail, { reportId: report.id });
        const newDetails = details.map((d) =>
          manager.create(ReportDetail, {
            ...d,
            report,
            totalCost: this.calculateSum(
              d.medicalCost,
              d.salaryCompensation,
              d.propertyDamage,
            ),
          }),
        );
        report.details = await manager.save(ReportDetail, newDetails);
      }
      report.status = dto.status || report.status;

      console.log("..........................", dto.status)

      await manager.save(Report, report);
    });

    return Response.get(await this.findOneById(id));
  }

  async changeStatus(id: number, dto: UpdateStatusDto, user: any) {
    const report = await this.reportRepository.findOne({ where: { id } });
    if (!report) throw new NotFoundException('Không tìm thấy báo cáo!');

    await this.dataSource.transaction(async (manager) => {
      report.status = dto.status;
      report.note = dto.note || report.note;
      await manager.save(Report, report);

      const history = manager.create(StatusHistory, {
        reportId: report.id,
        status: dto.status,
        note: dto.note || '',
        userId: user.id,
      });
      await manager.save(StatusHistory, history);
    });

    return Response.get({
      id: report.id,
      status: report.status,
      note: report.note,
    });
  }

  async changeStatusBulk(dto: BulkUpdateStatusDto, user: any) {
    const { ids, status, note } = dto;

    if (!ids || ids.length === 0) {
      throw new BadRequestException('Danh sách ID báo cáo không được để trống!');
    }

    const reports = await this.reportRepository.findBy({ id: In(ids) });
    if (reports.length === 0) {
      throw new NotFoundException('Không tìm thấy báo cáo nào khớp với danh sách ID đã cung cấp!');
    }

    await this.dataSource.transaction(async (manager) => {
      reports.forEach((report) => {
        report.status = status;
        report.note = note || report.note;
      });
      await manager.save(Report, reports);
    });

    return Response.get({
      message: `Cập nhật trạng thái hàng loạt thành công cho ${reports.length} báo cáo.`,
      updatedCount: reports.length,
      affectedIds: reports.map((r) => r.id),
    });
  }

  async getDetailForFE(id: number) {
    const report = await this.findOneById(id);
    if (!report) throw new NotFoundException('Không tìm thấy báo cáo!');
    return Response.get(report);
  }

  async getAllForAdmin(query: any) {
    const qb = this.reportRepository
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.doet', 'd')
      .leftJoinAndSelect('r.reportType', 'rt');

    if (query.year) {
      qb.andWhere('r.year = :year', { year: Number(query.year) });
    }
    if (query.status) {
      qb.andWhere('r.status = :status', { status: query.status });
    }

    if (query.period) {
      qb.andWhere('rt.period ILike :period', { period: `%${query.period.trim()}%` });
    }

    if (query.businessName) {
      qb.andWhere('d.name ILike :bName', { bName: `%${query.businessName.trim()}%` });
    }
    if (query.taxCode) {
      qb.andWhere('d.taxCode ILike :taxCode', { taxCode: `%${query.taxCode.trim()}%` });
    }

    if (query.province) {
      const pText = query.province.trim();
      qb.andWhere("(d.province->>'key' = :pKey OR d.province->>'value' ILike :pValue)", {
        pKey: pText,
        pValue: `%${pText}%`,
      });
    }

    if (query.district) {
      const dText = query.district.trim();
      qb.andWhere("(d.district->>'key' = :dKey OR d.district->>'value' ILike :dValue)", {
        dKey: dText,
        dValue: `%${dText}%`,
      });
    }

    if (query.ward) {
      const wText = query.ward.trim();
      qb.andWhere("(d.ward->>'key' = :wKey OR d.ward->>'value' ILike :wValue)", {
        wKey: wText,
        wValue: `%${wText}%`,
      });
    }

    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 10;

    qb.orderBy('r.year', 'DESC').addOrderBy('r.id', 'DESC');
    qb.skip((page - 1) * pageSize).take(pageSize);

    const [items, total] = await qb.getManyAndCount();
    return Response.get({ items, total, page, pageSize });
  }

  async getAllForBusiness(query: any, user: any) {
    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 10;

    const qb = this.reportRepository
      .createQueryBuilder('r')
      .leftJoinAndSelect('r.reportType', 'rt')
      .leftJoinAndSelect('r.doet', 'd')
      .where('r.doetId = :doetId', { doetId: user.doetId });

    qb.andWhere('rt.isActive = :isActive', { isActive: true });
    if (query.year) qb.andWhere('r.year = :year', { year: Number(query.year) });
    if (query.status)
      qb.andWhere('r.status = :status', { status: query.status });

    qb.orderBy('r.year', 'DESC').addOrderBy('r.id', 'DESC');
    qb.skip((page - 1) * pageSize).take(pageSize);

    const [items, total] = await qb.getManyAndCount();

    const doetIds = [
      ...new Set(items.map((item) => item.doet?.id).filter((id) => id)),
    ];

    if (doetIds.length > 0) {
      const doets = await this.dataSource.getRepository(Doet).find({
        where: { id: In(doetIds) },
        relations: { businessType: true, industry: true },
        withDeleted: true,
      });

      items.forEach((item) => {
        if (item.doet) {
          const fullDoet = doets.find((d) => d.id === item.doet.id);
          if (fullDoet) {
            item.doet = fullDoet;
          }
        }
      });
    }

    return Response.get({ items, total, page, pageSize });
  }

  async getSummaryReport(year: number) {
    const rawSummary = await this.reportRepository
      .createQueryBuilder('r')
      .leftJoin('r.doet', 'd')
      .leftJoin('d.businessType', 'bt')
      .select('bt.name', 'businesstypename')
      .addSelect('COUNT(DISTINCT d.id)', 'totalcompanies')
      .addSelect('SUM(r.m1TotalCases)', 'sumtotalcases')
      .addSelect('SUM(r.m1FatalCases)', 'sumfatalcases')
      .addSelect('SUM(r.m1TotalVictims)', 'sumtotalvictims')
      .addSelect('SUM(r.m1FemaleVictims)', 'sumfemalevictims')
      .addSelect('SUM(r.m1FatalVictims)', 'sumfatalvictims')
      .addSelect('SUM(r.m1SevereInjuries)', 'sumsevereinjuries')
      .addSelect('SUM(r.m1MedicalCost)', 'summedicalcost')
      .addSelect('SUM(r.m1SalaryCompensation)', 'sumsalarycompensation')
      .addSelect('SUM(r.m1PropertyDamage)', 'sumpropertydamage')
      .addSelect('SUM(r.m1TotalCost)', 'sumtotalcost')
      .where('r.year = :year', { year })
      .andWhere('r.status = :status', { status: ReportStatus.APPROVED })
      .groupBy('bt.name')
      .getRawMany();

    return Response.get(
      rawSummary.map((row) => ({
        businessTypeName: row.businesstypename || 'Chưa phân loại hình thức',
        totalCompanies: Number(row.totalcompanies) || 0,
        casesReport: {
          totalCases: Number(row.sumtotalcases) || 0,
          fatalCases: Number(row.sumfatalcases) || 0,
        },
        victimsReport: {
          totalVictims: Number(row.sumtotalvictims) || 0,
          femaleVictims: Number(row.sumfemalevictims) || 0,
          fatalVictims: Number(row.sumfatalvictims) || 0,
          severeInjuries: Number(row.sumsevereinjuries) || 0,
        },
        financialReport: {
          medicalCost: Number(row.summedicalcost) || 0,
          salaryCompensation: Number(row.sumsalarycompensation) || 0,
          propertyDamage: Number(row.sumpropertydamage) || 0,
          totalCost: Number(row.sumtotalcost) || 0,
        },
      })),
    );
  }
}
